import * as THREE from "three";

export type ShapeSpec = {
  geo: () => THREE.BufferGeometry;
  /** where the shape lives down the page, 0 = top, 1 = bottom */
  page: number;
  x: number;
  z: number;
  scale: number;
  spin: [number, number];
  drift: number;
  wire?: boolean;
};

export const SHAPES: ShapeSpec[] = [
  {
    geo: () => new THREE.IcosahedronGeometry(1, 0),
    page: 0.06,
    x: 4.6,
    z: -5,
    scale: 1.7,
    spin: [0.18, 0.24],
    drift: 0.42,
  },
  {
    geo: () => new THREE.TorusKnotGeometry(0.72, 0.24, 160, 24),
    page: 0.26,
    x: -4.9,
    z: -4.5,
    scale: 1.45,
    spin: [0.22, 0.3],
    drift: 0.55,
  },
  {
    geo: () => new THREE.OctahedronGeometry(1, 0),
    page: 0.34,
    x: 5.2,
    z: -6.5,
    scale: 2.0,
    spin: [0.3, 0.16],
    drift: 0.36,
    wire: true,
  },
  {
    geo: () => new THREE.TorusGeometry(1, 0.2, 20, 90),
    page: 0.48,
    x: -5.4,
    z: -5.5,
    scale: 1.75,
    spin: [0.26, 0.2],
    drift: 0.48,
  },
  {
    geo: () => new THREE.DodecahedronGeometry(1, 0),
    page: 0.62,
    x: 4.8,
    z: -4.8,
    scale: 1.55,
    spin: [0.2, 0.28],
    drift: 0.4,
  },
  {
    geo: () => new THREE.IcosahedronGeometry(1, 1),
    page: 0.76,
    x: -4.6,
    z: -7,
    scale: 2.05,
    spin: [0.15, 0.22],
    drift: 0.5,
    wire: true,
  },
  {
    geo: () => new THREE.TorusKnotGeometry(0.62, 0.2, 140, 20, 2, 3),
    page: 0.9,
    x: 5,
    z: -5.2,
    scale: 1.5,
    spin: [0.24, 0.18],
    drift: 0.44,
  },
];

/** Vertical distance in world units that the full page scroll maps to. */
export const SPREAD = 30;

export function layoutForWidth(width: number) {
  if (width < 640) return { squeeze: 0.42, scale: 0.52 };
  if (width < 768) return { squeeze: 0.5, scale: 0.6 };
  if (width < 1024) return { squeeze: 0.62, scale: 0.78 };
  if (width < 1280) return { squeeze: 0.72, scale: 0.9 };
  return { squeeze: 1, scale: 1 };
}
