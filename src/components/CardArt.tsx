import type { ReactNode } from "react";
import type { CardArtKind } from "@/lib/data";
import { GridLines } from "@/lib/svg";

const BARS: [number, number, number][] = [
  [70, 150, 46],
  [104, 122, 74],
  [138, 96, 100],
  [172, 138, 58],
  [206, 78, 118],
  [240, 110, 86],
];

const NODES: [number, number][] = [
  [160, 60],
  [92, 128],
  [228, 128],
  [160, 196],
];

function Radar({ fill }: { fill: string }) {
  return (
    <g stroke={fill} strokeWidth="1">
      {[26, 48, 70, 92].map((r) => (
        <circle key={r} cx="160" cy="128" r={r} opacity={0.55 - r / 320} />
      ))}
      <line x1="160" y1="36" x2="160" y2="220" opacity="0.25" />
      <line x1="68" y1="128" x2="252" y2="128" opacity="0.25" />
      <path
        d="M160 128 L160 36 A92 92 0 0 1 231 63 Z"
        fill={fill}
        opacity="0.16"
        stroke="none"
      />
      <circle cx="206" cy="92" r="4" fill="#7dd3fc" stroke="none" />
      <circle
        cx="122"
        cy="164"
        r="3"
        fill="#7dd3fc"
        stroke="none"
        opacity="0.6"
      />
      <circle
        cx="184"
        cy="172"
        r="2.5"
        fill="#7dd3fc"
        stroke="none"
        opacity="0.45"
      />
    </g>
  );
}

function Bars({ fill }: { fill: string }) {
  return (
    <g>
      <g stroke="#38bdf8" strokeWidth="0.6" opacity="0.16">
        <GridLines
          vertical={{ count: 9, start: 40, step: 30, y1: 40, y2: 200 }}
          horizontal={{ count: 6, start: 40, step: 32, x1: 40, x2: 280 }}
        />
      </g>
      {BARS.map(([x, y, h]) => (
        <rect
          key={x}
          x={x}
          y={y}
          width="18"
          height={h}
          rx="3"
          fill={fill}
          opacity="0.75"
        />
      ))}
      <path
        d="M79 148 L113 120 L147 94 L181 136 L215 76 L249 108"
        stroke="#7dd3fc"
        strokeWidth="1.6"
        opacity="0.9"
      />
    </g>
  );
}

function Nodes({ fill }: { fill: string }) {
  return (
    <g>
      <g stroke="#38bdf8" strokeWidth="1" opacity="0.4">
        <path d="M160 60 L92 128 M160 60 L228 128 M92 128 L160 196 M228 128 L160 196 M92 128 L228 128 M160 60 L160 196" />
      </g>
      {NODES.map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="16" fill="#04070d" />
          <circle cx={cx} cy={cy} r="16" stroke={fill} strokeWidth="1.4" />
          <circle cx={cx} cy={cy} r="4.5" fill="#7dd3fc" />
        </g>
      ))}
      <circle
        cx="160"
        cy="128"
        r="34"
        stroke="#7dd3fc"
        strokeWidth="1"
        opacity="0.35"
        strokeDasharray="4 6"
      />
    </g>
  );
}

const ART: Record<CardArtKind, (fill: string) => ReactNode> = {
  radar: (fill) => <Radar fill={fill} />,
  grid: (fill) => <Bars fill={fill} />,
  nodes: (fill) => <Nodes fill={fill} />,
};

/**
 * Abstract HUD artwork for the capability cards.
 * Cool cyan against the warm page — the same contrast the reference design uses.
 */
export default function CardArt({ kind }: { kind: CardArtKind }) {
  const fill = `url(#s-${kind})`;

  return (
    <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg bg-[#04070d]">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 70% at 50% 62%, rgba(56,189,248,0.22) 0%, rgba(8,20,38,0.6) 55%, #04070d 100%)",
        }}
      />
      <svg
        viewBox="0 0 320 240"
        className="absolute inset-0 h-full w-full"
        fill="none"
        aria-hidden
      >
        <defs>
          <linearGradient id={`s-${kind}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7dd3fc" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </linearGradient>
        </defs>
        {ART[kind](fill)}
      </svg>
      <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-sky-300/10" />
    </div>
  );
}
