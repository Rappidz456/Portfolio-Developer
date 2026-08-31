"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { layoutForWidth, SHAPES, SPREAD } from "@/lib/scene";
import { prefersReducedMotion } from "@/lib/utils";

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
    scene.fog = new THREE.FogExp2(0x060505, 0.048);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.05);
    scene.environment = envRT.texture;
    scene.environmentIntensity = 0.5;

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 10);

    scene.add(new THREE.AmbientLight(0x2a2016, 2.2));

    const keyLight = new THREE.PointLight(0xffb653, 260, 0, 2);
    keyLight.position.set(5, 3, 7);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0xf5efc5, 130, 0, 2);
    fillLight.position.set(-6, -2, 5);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x7a3f10, 180, 0, 2);
    rimLight.position.set(0, 4, -6);
    scene.add(rimLight);

    const solid = new THREE.MeshStandardMaterial({
      color: 0xc08a3a,
      metalness: 1,
      roughness: 0.17,
      emissive: 0x3a1c02,
      emissiveIntensity: 0.35,
    });

    const wire = new THREE.MeshBasicMaterial({
      color: 0xd99b3c,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });

    const geometries: THREE.BufferGeometry[] = [];
    const items = SHAPES.map((spec) => {
      const geometry = spec.geo();
      geometries.push(geometry);
      const mesh = new THREE.Mesh(geometry, spec.wire ? wire : solid);
      mesh.scale.setScalar(spec.scale);
      mesh.position.set(spec.x, 0, spec.z);
      scene.add(mesh);
      return { mesh, spec, seed: Math.random() * Math.PI * 2 };
    });

    let squeeze = 1;
    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const layout = layoutForWidth(w);
      squeeze = layout.squeeze;
      items.forEach(({ mesh, spec }) => {
        mesh.scale.setScalar(spec.scale * layout.scale);
      });
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
    let frame = 0;
    let running = true;

    const clock = new THREE.Clock();

    const tick = () => {
      if (!running) return;
      frame = requestAnimationFrame(tick);

      const t = clock.getElapsedTime();
      const max = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const target = window.scrollY / max;
      velocity += ((window.scrollY - lastScroll) * 0.02 - velocity) * 0.1;
      lastScroll = window.scrollY;
      progress += (target - progress) * 0.08;

      items.forEach(({ mesh, spec, seed }) => {
        mesh.position.y = (spec.page - progress) * SPREAD;
        mesh.position.x =
          spec.x * squeeze + Math.sin(t * spec.drift + seed) * 0.75;
        mesh.position.z = spec.z + Math.cos(t * spec.drift * 0.7 + seed) * 0.6;
        mesh.rotation.x += 0.0028 * spec.spin[0] * 60 * 0.016 + velocity * 0.002;
        mesh.rotation.y += 0.0032 * spec.spin[1] * 60 * 0.016 + velocity * 0.003;
      });

      camera.position.x += (pointer.x * 0.7 - camera.position.x) * 0.04;
      camera.position.y += (-pointer.y * 0.5 - camera.position.y) * 0.04;
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
      clock.getDelta();
      tick();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      geometries.forEach((g) => g.dispose());
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
