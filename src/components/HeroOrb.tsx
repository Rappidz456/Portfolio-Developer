"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  pointBudget,
  RING_RADIUS,
  RING_TILT,
  ringField,
  sphereField,
  SPHERE_RADIUS,
} from "@/lib/scene";
import { prefersReducedMotion } from "@/lib/utils";

/**
 * The hero centrepiece. Sized to its own container rather than the viewport, so
 * it stays a composed object in the layout instead of a full-page backdrop.
 */
export default function HeroOrb() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = host.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      return;
    }

    const still = prefersReducedMotion();

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearAlpha(0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50);
    camera.position.set(0, 0, 10.2);

    const budget = pointBudget(window.innerWidth);

    const group = new THREE.Group();
    // Tipped slightly so the ring reads as an orbit in perspective rather than
    // as a line through the middle.
    group.rotation.set(0.24, 0, -0.12);
    scene.add(group);

    const makePoints = (
      field: { positions: Float32Array; colors: Float32Array },
      size: number,
      opacity: number
    ) => {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(field.positions, 3)
      );
      geometry.setAttribute("color", new THREE.BufferAttribute(field.colors, 3));
      const material = new THREE.PointsMaterial({
        size,
        vertexColors: true,
        sizeAttenuation: true,
        transparent: true,
        opacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      return new THREE.Points(geometry, material);
    };

    const shell = makePoints(
      sphereField(budget.sphere, SPHERE_RADIUS),
      budget.size,
      0.95
    );
    group.add(shell);

    const ring = makePoints(
      ringField(budget.ring, RING_RADIUS),
      budget.size * 1.5,
      1
    );
    ring.rotation.x = THREE.MathUtils.degToRad(RING_TILT);
    ring.rotation.z = THREE.MathUtils.degToRad(-14);
    group.add(ring);

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = mount;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      // Nothing is animating in the reduced-motion case, so repaint here or the
      // canvas keeps the old frame at the new size.
      if (still) renderer.render(scene, camera);
    };
    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(mount);

    // Pointer nudges the whole composition a few degrees — enough to feel
    // dimensional, not enough to swing it around.
    const pointer = { x: 0, y: 0 };
    const onPointer = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    if (!still) {
      window.addEventListener("pointermove", onPointer, { passive: true });
    }

    let visible = true;
    const clock = new THREE.Clock();
    let frameId = 0;
    const tilt = { x: 0.24, y: 0 };

    const tick = () => {
      if (!visible) {
        frameId = 0;
        return;
      }
      frameId = requestAnimationFrame(tick);

      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.getElapsedTime();

      group.rotation.y += dt * 0.09;
      ring.rotation.y += dt * 0.06;

      tilt.x += (0.24 + -pointer.y * 0.16 - tilt.x) * 0.05;
      tilt.y += (pointer.x * 0.2 - tilt.y) * 0.05;
      group.rotation.x = tilt.x;
      group.rotation.z = -0.12 + tilt.y * 0.35;

      // A slow breath, just enough that it never looks frozen.
      group.scale.setScalar(1 + Math.sin(t * 0.5) * 0.014);

      renderer.render(scene, camera);
    };

    if (still) {
      renderer.render(scene, camera);
    } else {
      tick();
    }

    // Only burn frames while the hero is actually on screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !still && !frameId) {
          clock.getDelta();
          tick();
        }
      },
      { threshold: 0 }
    );
    io.observe(mount);

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frameId);
        frameId = 0;
        return;
      }
      if (visible && !still && !frameId) {
        clock.getDelta();
        tick();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(frameId);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
      observer.disconnect();
      io.disconnect();
      [shell, ring].forEach((points) => {
        points.geometry.dispose();
        (points.material as THREE.Material).dispose();
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={host}
      aria-hidden
      className="absolute inset-0 [&>canvas]:block [&>canvas]:h-full [&>canvas]:w-full"
    />
  );
}
