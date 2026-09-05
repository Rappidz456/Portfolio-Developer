import * as THREE from "three";

export type FloaterSpec = {
  geo: () => THREE.BufferGeometry;
  /** 0 = top of the page, 1 = bottom. */
  page: number;
  x: number;
  z: number;
  scale: number;
  spin: [number, number];
  drift: number;
  wire?: boolean;
  edges?: boolean;
};

export const FLOATERS: FloaterSpec[] = [
  {
    geo: () => new THREE.IcosahedronGeometry(1, 0),
    page: 0.07,
    x: 5.1,
    z: -5.2,
    scale: 1.15,
    spin: [0.18, 0.26],
    drift: 0.4,
    edges: true,
  },
  {
    geo: () => new THREE.TorusKnotGeometry(0.7, 0.22, 120, 18),
    page: 0.2,
    x: -5.2,
    z: -4.6,
    scale: 1.0,
    spin: [0.22, 0.3],
    drift: 0.52,
  },
  {
    geo: () => new THREE.OctahedronGeometry(1, 0),
    page: 0.34,
    x: 5.4,
    z: -6.4,
    scale: 1.35,
    spin: [0.28, 0.16],
    drift: 0.36,
    wire: true,
  },
  {
    geo: () => new THREE.TorusGeometry(1, 0.22, 18, 72),
    page: 0.48,
    x: -5.5,
    z: -5.4,
    scale: 1.2,
    spin: [0.24, 0.2],
    drift: 0.46,
    edges: true,
  },
  {
    geo: () => new THREE.DodecahedronGeometry(1, 0),
    page: 0.62,
    x: 5.0,
    z: -4.9,
    scale: 1.1,
    spin: [0.2, 0.28],
    drift: 0.38,
    edges: true,
  },
  {
    geo: () => new THREE.IcosahedronGeometry(1, 1),
    page: 0.76,
    x: -4.8,
    z: -6.8,
    scale: 1.4,
    spin: [0.14, 0.22],
    drift: 0.5,
    wire: true,
  },
  {
    geo: () => new THREE.TorusKnotGeometry(0.58, 0.18, 110, 16, 2, 3),
    page: 0.9,
    x: 5.2,
    z: -5.1,
    scale: 1.05,
    spin: [0.24, 0.18],
    drift: 0.44,
  },
];

/** World units the full-page scroll maps onto. */
export const SPREAD = 32;

export function layoutForWidth(width: number) {
  if (width < 640) return { squeeze: 0.38, scale: 0.52, count: 4, stars: 220 };
  if (width < 768) return { squeeze: 0.48, scale: 0.62, count: 5, stars: 320 };
  if (width < 1024) return { squeeze: 0.62, scale: 0.76, count: 6, stars: 420 };
  if (width < 1280)
    return { squeeze: 0.78, scale: 0.88, count: FLOATERS.length, stars: 520 };
  return { squeeze: 1, scale: 0.95, count: FLOATERS.length, stars: 640 };
}
