"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import {
  DUST_TUBE_RADIUS,
  GATE_COUNT,
  GATE_NEAR_FADE,
  frameAt,
  layoutForWidth,
  STATIONS,
} from "@/lib/scene";
import { prefersReducedMotion } from "@/lib/utils";

const BASE_FOV = 48;
const LOOK_AHEAD = 6;

/** A sculpture is invisible this close to the camera, and solid from here out. */
const STATION_NEAR_FADE = 6;
const STATION_FULL = 22;

export default function Scene3D() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = host.current;
    if (!mount) return;
    if (prefersReducedMotion()) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearAlpha(0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    // Tight enough that the far end of the flight fades out, so the corridor
    // reads as deep rather than as a finite box.
    scene.fog = new THREE.FogExp2(0x060505, 0.034);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.05);
    scene.environment = envRT.texture;
    scene.environmentIntensity = 0.5;

    const camera = new THREE.PerspectiveCamera(
      BASE_FOV,
      window.innerWidth / window.innerHeight,
      0.1,
      120
    );

    scene.add(new THREE.AmbientLight(0x2a2016, 2.2));

    // The key and rim lights ride along with the camera, so a sculpture is lit
    // the same way wherever you meet it on the flight.
    const keyLight = new THREE.PointLight(0xffb653, 210, 0, 2);
    const fillLight = new THREE.PointLight(0xf5efc5, 130, 0, 2);
    const rimLight = new THREE.PointLight(0x7a3f10, 200, 0, 2);
    scene.add(keyLight, fillLight, rimLight);

    const solid = new THREE.MeshStandardMaterial({
      color: 0xc08a3a,
      metalness: 1,
      roughness: 0.24,
      emissive: 0x3a1c02,
      emissiveIntensity: 0.22,
    });

    const wire = new THREE.MeshBasicMaterial({
      color: 0xd99b3c,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });

    let layout = layoutForWidth(window.innerWidth);

    // ---- Sculptures, pinned to points along the path -----------------------
    const geometries: THREE.BufferGeometry[] = [];
    // Each sculpture gets its own material so it can fade on approach. Without
    // that, passing close to one drops a bright metal mass straight across the
    // page copy.
    const materials: THREE.Material[] = [];
    const items = STATIONS.map((spec) => {
      const geometry = spec.geo();
      geometries.push(geometry);
      const material = (spec.wire ? wire : solid).clone();
      material.transparent = true;
      materials.push(material);
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      return {
        mesh,
        material,
        baseOpacity: spec.wire ? 0.45 : 1,
        spec,
        frame: frameAt(spec.t),
        base: new THREE.Vector3(),
        seed: Math.random() * Math.PI * 2,
      };
    });

    const placeStations = () => {
      items.forEach((item) => {
        const { position, right, up } = item.frame;
        const [ox, oy] = item.spec.offset;
        item.base
          .copy(position)
          .addScaledVector(right, ox * layout.squeeze)
          .addScaledVector(up, oy * layout.squeeze);
        item.mesh.scale.setScalar(item.spec.scale * layout.scale);
      });
    };

    // ---- Gates threaded onto the path --------------------------------------
    const gateGeo = new THREE.TorusGeometry(1, 0.01, 3, 96);
    const gateMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const gates = new THREE.InstancedMesh(gateGeo, gateMat, GATE_COUNT);
    gates.frustumCulled = false;
    scene.add(gates);

    const gateSeeds = Array.from({ length: GATE_COUNT }, () => 0.82 + Math.random() * 0.36);
    const gateOrigins = Array.from({ length: GATE_COUNT }, (_, i) =>
      frameAt((i + 0.5) / GATE_COUNT)
    );
    const FORWARD = new THREE.Vector3(0, 0, 1);
    const GATE_TINT = new THREE.Color(0xd99b3c);
    const gateColor = new THREE.Color();

    const placeGates = () => {
      const matrix = new THREE.Matrix4();
      const quaternion = new THREE.Quaternion();
      const scale = new THREE.Vector3();
      for (let i = 0; i < GATE_COUNT; i++) {
        const { position, tangent } = gateOrigins[i];
        quaternion.setFromUnitVectors(FORWARD, tangent);
        const r = layout.gateRadius * gateSeeds[i];
        scale.set(r, r, r);
        matrix.compose(position, quaternion, scale);
        gates.setMatrixAt(i, matrix);
      }
      gates.instanceMatrix.needsUpdate = true;
    };

    /** Brightness per gate, from how far ahead of the camera it sits. */
    const fadeGates = () => {
      for (let i = 0; i < GATE_COUNT; i++) {
        const d = camera.position.distanceTo(gateOrigins[i].position);
        const alpha =
          THREE.MathUtils.smoothstep(d, 0, GATE_NEAR_FADE) *
          (1 - THREE.MathUtils.smoothstep(d, layout.gateFar * 0.55, layout.gateFar));
        gates.setColorAt(
          i,
          gateColor.copy(GATE_TINT).multiplyScalar(alpha * layout.gateAlpha)
        );
      }
      if (gates.instanceColor) gates.instanceColor.needsUpdate = true;
    };

    // ---- Dust, filling a tube around the path ------------------------------
    // Sampling along the path (rather than in a world-space box) keeps the
    // density even from the first frame of the flight to the last.
    const dustCount = layout.dust;
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      const { position, right, up } = frameAt(Math.random());
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.sqrt(Math.random()) * DUST_TUBE_RADIUS;
      const p = position
        .clone()
        .addScaledVector(right, Math.cos(angle) * radius)
        .addScaledVector(up, Math.sin(angle) * radius);
      dustPos.set([p.x, p.y, p.z], i * 3);
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xf5efc5,
      size: 0.05,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    dust.frustumCulled = false;
    scene.add(dust);

    placeStations();
    placeGates();

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      // Dust count is fixed at mount; only the layout-driven placement is
      // recomputed, which keeps a resize from rebuilding the whole buffer.
      layout = layoutForWidth(w);
      placeStations();
      placeGates();
    };
    resize();
    window.addEventListener("resize", resize);

    const pointer = { x: 0, y: 0 };
    const onPointer = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    let progress = 0;
    let velocity = 0;
    let lastScroll = window.scrollY;
    let frameId = 0;
    let running = true;

    const clock = new THREE.Clock();
    const camPos = new THREE.Vector3();
    const lookTarget = new THREE.Vector3();

    const tick = () => {
      if (!running) return;
      frameId = requestAnimationFrame(tick);

      const t = clock.getElapsedTime();
      const max = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const target = window.scrollY / max;
      velocity += ((window.scrollY - lastScroll) * 0.02 - velocity) * 0.1;
      lastScroll = window.scrollY;
      progress += (target - progress) * 0.08;

      const clamped = THREE.MathUtils.clamp(progress, 0, 1);
      const { position, right, up, tangent } = frameAt(clamped);

      // Pointer nudges the camera off the rail without steering it.
      camPos
        .copy(position)
        .addScaledVector(right, pointer.x * 0.9)
        .addScaledVector(up, -pointer.y * 0.6);
      camera.position.lerp(camPos, 0.08);

      lookTarget.copy(position).addScaledVector(tangent, LOOK_AHEAD);
      camera.up.copy(up);
      camera.lookAt(lookTarget);
      // A touch of roll into the direction of travel.
      camera.rotateZ(THREE.MathUtils.clamp(velocity * 0.0016, -0.07, 0.07));

      // Scroll speed opens the lens slightly — reads as acceleration.
      const fov = BASE_FOV + THREE.MathUtils.clamp(Math.abs(velocity) * 0.22, 0, 7);
      if (Math.abs(camera.fov - fov) > 0.01) {
        camera.fov += (fov - camera.fov) * 0.12;
        camera.updateProjectionMatrix();
      }

      keyLight.position.copy(camera.position).addScaledVector(right, 5).addScaledVector(up, 3);
      fillLight.position.copy(camera.position).addScaledVector(right, -6).addScaledVector(up, -2);
      rimLight.position.copy(position).addScaledVector(tangent, 14);

      fadeGates();

      dustMat.opacity =
        0.42 + THREE.MathUtils.clamp(Math.abs(velocity) * 0.012, 0, 0.3);

      items.forEach(({ mesh, material, baseOpacity, spec, base, seed }) => {
        mesh.position.set(
          base.x + Math.sin(t * spec.drift + seed) * 0.75,
          base.y + Math.cos(t * spec.drift * 0.8 + seed) * 0.5,
          base.z + Math.cos(t * spec.drift * 0.7 + seed) * 0.6
        );
        mesh.rotation.x += 0.0028 * spec.spin[0] * 60 * 0.016 + velocity * 0.002;
        mesh.rotation.y += 0.0032 * spec.spin[1] * 60 * 0.016 + velocity * 0.003;
        const d = camera.position.distanceTo(mesh.position);
        material.opacity =
          baseOpacity * THREE.MathUtils.smoothstep(d, STATION_NEAR_FADE, STATION_FULL);
      });

      renderer.render(scene, camera);
    };
    tick();

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(frameId);
        return;
      }
      running = true;
      clock.getDelta();
      tick();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(frameId);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      gateGeo.dispose();
      gateMat.dispose();
      gates.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      solid.dispose();
      wire.dispose();
      envRT.texture.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={host}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[5] [&>canvas]:h-full [&>canvas]:w-full"
    />
  );
}
