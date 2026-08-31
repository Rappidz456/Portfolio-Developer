import type { CSSProperties } from "react";

type Blob = {
  className: string;
  opacity: number;
  delay?: string;
  style: CSSProperties;
};

const BLOBS: Blob[] = [
  {
    className: "fog drift-slow",
    opacity: 0.9,
    style: {
      left: "-10%",
      top: "-14%",
      width: "72vw",
      height: "72vw",
      background:
        "radial-gradient(circle, rgba(217,155,60,0.30) 0%, rgba(122,63,16,0.16) 44%, transparent 70%)",
    },
  },
  {
    className: "fog drift-slower",
    opacity: 0.85,
    style: {
      right: "-18%",
      top: "6%",
      width: "60vw",
      height: "60vw",
      background:
        "radial-gradient(circle, rgba(190,120,40,0.24) 0%, rgba(60,30,10,0.16) 46%, transparent 72%)",
    },
  },
  {
    className: "fog drift-slow",
    opacity: 0.8,
    delay: "-9s",
    style: {
      left: "22%",
      bottom: "-30%",
      width: "84vw",
      height: "62vw",
      background:
        "radial-gradient(circle, rgba(217,155,60,0.20) 0%, rgba(20,12,6,0.2) 50%, transparent 74%)",
    },
  },
];

/**
 * Warm volumetric haze used behind the hero and the contact band.
 * Pure CSS — blurred radial blobs drifting on long, offset loops.
 */
export default function Atmosphere({
  intensity = 1,
}: {
  intensity?: number;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {BLOBS.map((blob, i) => (
        <div
          key={i}
          className={blob.className}
          style={{
            ...blob.style,
            opacity: blob.opacity * intensity,
            ...(blob.delay ? { animationDelay: blob.delay } : {}),
          }}
        />
      ))}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 42%, transparent 34%, rgba(6,5,5,0.28) 74%, rgba(6,5,5,0.55) 100%)",
        }}
      />
    </div>
  );
}
