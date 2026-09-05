"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { FLOATERS, layoutForWidth, SPREAD } from "@/lib/floaters";
import {
  createPointMaterial,
  emptyField,
  toGeometry,
} from "@/lib/points";
import { prefersReducedMotion } from "@/lib/utils";

type Item = {
  mesh: THREE.Mesh;
  spec: (typeof FLOATERS)[number];
  seed: number;
  baseScale: number;
  material: THREE.Material;
};

function starField(count: number) {
  const field = emptyField(count);
  const cream = new THREE.Color(0xf5efc5);
  const amber = new THREE.Color(0xd99b3c);
  const tint = new THREE.Color();

  for (let i = 0; i < count; i++) {
    field.positions[i * 3] = (Math.random() - 0.5) * 36;
    field.positions[i * 3 + 1] = (Math.random() - 0.5) * 48;
    field.positions[i * 3 + 2] = -4 - Math.random() * 42;
    tint.copy(cream).lerp(amber, Math.random());
    field.colors[i * 3] = tint.r;
    field.colors[i * 3 + 1] = tint.g;
    field.colors[i * 3 + 2] = tint.b;
    field.phases[i] = Math.random() * Math.PI * 2;
    field.scales[i] = 0.35 + Math.random() * 1.5;
  }

  return field;
}

/**
 * Scroll flies you toward each sculpture: the active piece comes forward,
 * the camera leans in, and a starfield streams past.
 */
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

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearAlpha(0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080706, 0.038);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0);
    scene.environment = envRT.texture;
    scene.environmentIntensity = 0.58;

    const camera = new THREE.PerspectiveCamera(
      42,
      window.innerWidth / window.innerHeight,
      0.1,
      90
    );
    camera.position.set(0, 0, 11);

    scene.add(new THREE.AmbientLight(0x2a2016, 1.8));

    const key = new THREE.DirectionalLight(0xffc56a, 2.5);
    key.position.set(6, 4, 8);
    scene.add(key);

    const fill = new THREE.PointLight(0xf5efc5, 90, 0, 2);
    fill.position.set(-7, -1, 5);
    scene.add(fill);

    const rim = new THREE.PointLight(0x7a3f10, 140, 0, 2);
    rim.position.set(0, 5, -7);
    scene.add(rim);

    const solidProto = new THREE.MeshStandardMaterial({
      color: 0xc08a3a,
      metalness: 1,
      roughness: 0.16,
      emissive: 0x3a1c02,
      emissiveIntensity: 0.32,
    });

    const wireProto = new THREE.MeshBasicMaterial({
      color: 0xe0b15a,
      wireframe: true,
      transparent: true,
      opacity: 0.42,
    });

    const edgeMat = new THREE.LineBasicMaterial({
      color: 0xf5efc5,
      transparent: true,
      opacity: 0.22,
    });

    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [solidProto, wireProto, edgeMat];
    const extras: THREE.Object3D[] = [];
    const items: Item[] = FLOATERS.map((spec) => {
      const geometry = spec.geo();
      geometries.push(geometry);
      const material = spec.wire ? wireProto.clone() : solidProto.clone();
      materials.push(material);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.scale.setScalar(spec.scale);
      mesh.position.set(spec.x, 0, spec.z);
      scene.add(mesh);

      if (spec.edges && !spec.wire) {
        const edgeGeo = new THREE.EdgesGeometry(geometry, 18);
        geometries.push(edgeGeo);
        const lines = new THREE.LineSegments(edgeGeo, edgeMat);
        mesh.add(lines);
        extras.push(lines);
      }

      return {
        mesh,
        spec,
        seed: Math.random() * Math.PI * 2,
        baseScale: spec.scale,
        material,
      };
    });

    const initial = layoutForWidth(window.innerWidth);
    const starsGeo = toGeometry(starField(initial.stars));
    geometries.push(starsGeo);
    const starsMat = createPointMaterial({
      size: 0.085,
      opacity: 0.7,
      near: 6,
      far: 48,
      twinkle: 0.35,
    });
    materials.push(starsMat);
    const stars = new THREE.Points(starsGeo, starsMat);
    scene.add(stars);

    let squeeze = 1;
    const applyLayout = () => {
      const layout = layoutForWidth(window.innerWidth);
      squeeze = layout.squeeze;
      items.forEach((item, i) => {
        const on = i < layout.count;
        item.mesh.visible = on;
        item.baseScale = item.spec.scale * layout.scale;
      });
    };

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      starsMat.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 1.75);
      applyLayout();
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
    let frame = 0;
    let running = true;
    const t0 = performance.now();
    const camGoal = new THREE.Vector3(0, 0, 11);

    const tick = () => {
      if (!running) return;
      frame = requestAnimationFrame(tick);

      const t = (performance.now() - t0) / 1000;
      const max = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const target = window.scrollY / max;
      progress += (target - progress) * 0.085;

      items.forEach((item) => {
        const { mesh, spec, seed, baseScale, material } = item;
        if (!mesh.visible) return;

        mesh.position.y = (spec.page - progress) * SPREAD;
        mesh.position.x =
          spec.x * squeeze + Math.sin(t * spec.drift + seed) * 0.55;
        mesh.position.z =
          spec.z + Math.cos(t * spec.drift * 0.72 + seed) * 0.4;
        mesh.scale.setScalar(baseScale);
        mesh.rotation.x += 0.0026 * spec.spin[0];
        mesh.rotation.y += 0.003 * spec.spin[1];

        if (spec.wire) {
          (material as THREE.MeshBasicMaterial).opacity = 0.42;
        } else {
          (material as THREE.MeshStandardMaterial).emissiveIntensity = 0.32;
        }
      });

      starsMat.uniforms.uTime.value = t;

      camGoal.set(pointer.x * 0.7, -pointer.y * 0.45, 11);
      camera.position.x += (camGoal.x - camera.position.x) * 0.04;
      camera.position.y += (camGoal.y - camera.position.y) * 0.04;
      camera.position.z += (camGoal.z - camera.position.z) * 0.04;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    tick();

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(frame);
        return;
      }
      running = true;
      tick();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      extras.forEach((obj) => obj.removeFromParent());
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
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
      className="pointer-events-none fixed inset-0 z-[4] [&>canvas]:h-full [&>canvas]:w-full"
    />
  );
}
