import * as THREE from "three";

/**
 * Shared look for every point field on the site.
 *
 * three's own PointsMaterial draws hard squares and treats every point
 * identically. This gives round, soft-edged points that fade with distance —
 * so a cloud reads as volume rather than as a flat sprinkle — plus a slow
 * per-point twinkle from a baked random phase.
 */

const VERTEX = /* glsl */ `
  attribute vec3 aColor;
  attribute float aPhase;
  attribute float aScale;

  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uNear;
  uniform float uFar;
  uniform float uTwinkle;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vColor = aColor;

    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float dist = max(-mv.z, 0.001);

    float twinkle = 1.0 - uTwinkle + uTwinkle * sin(uTime * 0.9 + aPhase);

    gl_PointSize = clamp(
      uSize * aScale * uPixelRatio * (300.0 / dist) * twinkle,
      0.0,
      64.0
    );

    // Near points solid, far points dissolving into the dark.
    vAlpha = (1.0 - smoothstep(uNear, uFar, dist)) * twinkle;

    gl_Position = projectionMatrix * mv;
  }
`;

const FRAGMENT = /* glsl */ `
  uniform float uOpacity;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float mask = smoothstep(0.5, 0.1, d);
    if (mask <= 0.001) discard;
    gl_FragColor = vec4(vColor, mask * vAlpha * uOpacity);
  }
`;

export type PointMaterialOptions = {
  size: number;
  opacity: number;
  /** Distance at which points start fading out. */
  near?: number;
  far?: number;
  /** 0 = steady, 0.5 = strong flicker. */
  twinkle?: number;
};

export function createPointMaterial({
  size,
  opacity,
  near = 14,
  far = 46,
  twinkle = 0.22,
}: PointMaterialOptions) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uSize: { value: size },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uOpacity: { value: opacity },
      uNear: { value: near },
      uFar: { value: far },
      uTwinkle: { value: twinkle },
    },
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}

export type Field = {
  positions: Float32Array;
  colors: Float32Array;
  phases: Float32Array;
  scales: Float32Array;
};

/** Wires a Field onto a BufferGeometry using the attribute names the shader expects. */
export function toGeometry(field: Field) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(field.positions, 3));
  geometry.setAttribute("aColor", new THREE.BufferAttribute(field.colors, 3));
  geometry.setAttribute("aPhase", new THREE.BufferAttribute(field.phases, 1));
  geometry.setAttribute("aScale", new THREE.BufferAttribute(field.scales, 1));
  return geometry;
}

export function emptyField(count: number): Field {
  return {
    positions: new Float32Array(count * 3),
    colors: new Float32Array(count * 3),
    phases: new Float32Array(count),
    scales: new Float32Array(count),
  };
}
