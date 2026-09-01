import * as THREE from "three";

/**
 * The scene is a flight, not a backdrop. Scrolling moves the camera along
 * FLIGHT_PATH; everything else is fixed in world space, so the parallax you see
 * is real depth rather than props sliding past a static lens.
 */
const FLIGHT_PATH: [number, number, number][] = [
  [0, 1.5, 16],
  [2.2, 0, 6],
  [-2.6, -2.4, -5],
  [3, -5.2, -16],
  [-2, -8.4, -27],
  [1.8, -11.6, -38],
  [-0.6, -14.4, -49],
  [0, -16.5, -60],
];

export const flightPath = new THREE.CatmullRomCurve3(
  FLIGHT_PATH.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
  false,
  "catmullrom",
  0.4
);

/** Extra arc-length samples so getPointAt moves at a constant speed. */
flightPath.arcLengthDivisions = 800;

export type Station = {
  /** Position along the flight path, 0 = start, 1 = end. */
  t: number;
  /** Sideways / vertical offset from the path, in world units. */
  offset: [number, number];
  geo: () => THREE.BufferGeometry;
  scale: number;
  spin: [number, number];
  drift: number;
  wire?: boolean;
};

/**
 * Sculptures the camera passes. Offsets are kept well off-axis so they sweep
 * through the edges of the frame and never sit behind the page copy.
 */
export const STATIONS: Station[] = [
  {
    t: 0.12,
    offset: [7.6, 1.6],
    geo: () => new THREE.IcosahedronGeometry(1, 0),
    scale: 1.8,
    spin: [0.18, 0.24],
    drift: 0.42,
  },
  {
    t: 0.23,
    offset: [-7.9, -0.8],
    geo: () => new THREE.TorusKnotGeometry(0.72, 0.24, 160, 24),
    scale: 1.5,
    spin: [0.22, 0.3],
    drift: 0.55,
  },
  {
    t: 0.34,
    offset: [8.4, 2.6],
    geo: () => new THREE.OctahedronGeometry(1, 0),
    scale: 2.1,
    spin: [0.3, 0.16],
    drift: 0.36,
    wire: true,
  },
  {
    t: 0.45,
    offset: [-8.6, 1.8],
    geo: () => new THREE.TorusGeometry(1, 0.2, 20, 90),
    scale: 1.8,
    spin: [0.26, 0.2],
    drift: 0.48,
  },
  {
    t: 0.56,
    offset: [7.8, -2.4],
    geo: () => new THREE.DodecahedronGeometry(1, 0),
    scale: 1.6,
    spin: [0.2, 0.28],
    drift: 0.4,
  },
  {
    t: 0.67,
    offset: [-7.6, -2.8],
    geo: () => new THREE.IcosahedronGeometry(1, 1),
    scale: 2.1,
    spin: [0.15, 0.22],
    drift: 0.5,
    wire: true,
  },
  {
    t: 0.78,
    offset: [8.2, 2],
    geo: () => new THREE.TorusKnotGeometry(0.62, 0.2, 140, 20, 2, 3),
    scale: 1.55,
    spin: [0.24, 0.18],
    drift: 0.44,
  },
  {
    t: 0.9,
    offset: [-7.4, 1],
    geo: () => new THREE.OctahedronGeometry(1, 1),
    scale: 1.7,
    spin: [0.2, 0.26],
    drift: 0.38,
    wire: true,
  },
];

/**
 * Thin rings threaded onto the path, perpendicular to it. The camera flies
 * through the middle of each one — the single strongest cue that you are
 * travelling forward rather than watching things drift.
 */
export const GATE_COUNT = 20;
export const GATE_RADIUS = 10;

/**
 * A gate is hidden once the camera is nearly on top of it — otherwise the ring
 * you are passing through flares across the page copy — and faded in from the
 * far end so new ones arrive out of the fog rather than popping in.
 */
export const GATE_NEAR_FADE = 16;
export const GATE_FAR_FADE = 62;

/** Dust drawn in a tube around the path, so density stays even for the whole flight. */
export const DUST_TUBE_RADIUS = 16;

export type Layout = {
  /**
   * Scales the sculptures' distance from the path. A narrow viewport has a
   * narrow *horizontal* FOV, so things must sit further off-axis to clear the
   * reading column — the opposite of what a static camera would want.
   */
  squeeze: number;
  scale: number;
  dust: number;
  gateRadius: number;
  /** Peak gate brightness. Narrow frames see further down the tube, so the
   * rings stack up and have to be dimmer to stay out of the way. */
  gateAlpha: number;
  /** Distance at which a gate has fully faded into the fog. */
  gateFar: number;
};

export function layoutForWidth(width: number): Layout {
  if (width < 640)
    return {
      squeeze: 1,
      scale: 0.55,
      dust: 900,
      gateRadius: GATE_RADIUS,
      gateAlpha: 0.2,
      gateFar: 34,
    };
  if (width < 768)
    return {
      squeeze: 1,
      scale: 0.62,
      dust: 1200,
      gateRadius: GATE_RADIUS,
      gateAlpha: 0.26,
      gateFar: 40,
    };
  if (width < 1024)
    return {
      squeeze: 0.95,
      scale: 0.75,
      dust: 1800,
      gateRadius: GATE_RADIUS,
      gateAlpha: 0.34,
      gateFar: 48,
    };
  if (width < 1280)
    return {
      squeeze: 0.9,
      scale: 0.88,
      dust: 2400,
      gateRadius: GATE_RADIUS,
      gateAlpha: 0.42,
      gateFar: 56,
    };
  return {
    squeeze: 1,
    scale: 1,
    dust: 3200,
    gateRadius: GATE_RADIUS,
    gateAlpha: 0.5,
    gateFar: GATE_FAR_FADE,
  };
}

/**
 * Builds the right/up vectors for the path at `t`, so things can be placed
 * relative to the flight rather than to world axes.
 */
const WORLD_UP = new THREE.Vector3(0, 1, 0);

export function frameAt(t: number) {
  const position = flightPath.getPointAt(THREE.MathUtils.clamp(t, 0, 1));
  const tangent = flightPath.getTangentAt(THREE.MathUtils.clamp(t, 0, 1));
  const right = new THREE.Vector3()
    .crossVectors(tangent, WORLD_UP)
    .normalize();
  const up = new THREE.Vector3().crossVectors(right, tangent).normalize();
  return { position, tangent, right, up };
}
