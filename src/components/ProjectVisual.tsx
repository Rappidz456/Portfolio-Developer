import Image from "next/image";
import type { MediaShot, Project } from "@/lib/data";
import { GridLines } from "@/lib/svg";
import { cn } from "@/lib/utils";
import { Glow } from "./ui";

function AccentBloom({
  accent,
  className,
  alpha = "33",
}: {
  accent: string;
  className?: string;
  alpha?: string;
}) {
  return (
    <Glow
      className={cn("-z-10 blur-3xl", className)}
      color={`${accent}${alpha}`}
    />
  );
}

function BrowserFrame({ project }: { project: Project }) {
  if (!project.shot) return null;

  return (
    <div className="glass relative rounded-2xl p-2.5 sm:p-3">
      <AccentBloom accent={project.accent} className="-inset-8 rounded-[2rem] opacity-60" />
      <div className="overflow-hidden rounded-xl bg-[#07060a] ring-1 ring-cream/10">
        <div className="flex items-center gap-2 border-b border-white/6 px-4 py-2.5">
          <span className="h-2 w-2 rounded-full bg-cream/25" />
          <span className="h-2 w-2 rounded-full bg-cream/15" />
          <span className="h-2 w-2 rounded-full bg-cream/10" />
          <span className="ml-2 truncate rounded-md bg-white/5 px-2.5 py-1 text-[10px] tracking-wide text-cream/40">
            {project.hrefLabel}
          </span>
        </div>
        <div className="relative aspect-16/11 w-full">
          <Image
            src={project.shot.src}
            alt={`${project.name} website`}
            fill
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="object-cover object-top"
          />
        </div>
      </div>
    </div>
  );
}

function Phone({
  shot,
  alt,
  className,
  priority,
}: {
  shot: MediaShot;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.75rem] bg-[#07060a] p-1.5 ring-1 ring-cream/15 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.95)]",
        className
      )}
    >
      <div className="relative aspect-[600/1300] w-full overflow-hidden rounded-[1.4rem]">
        <Image
          src={shot.src}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 30vw, 18vw"
          className="object-cover"
          priority={priority}
        />
      </div>
      <span className="absolute left-1/2 top-2.5 h-1.5 w-10 -translate-x-1/2 rounded-full bg-black/60" />
    </div>
  );
}

function phoneFrameClass(index: number, count: number) {
  if (count === 1) return "z-10 w-[40%]";
  const mid = Math.floor(count / 2);
  if (index === mid) return "z-10 w-[34%]";
  const side = "w-[28%] translate-y-3 opacity-85 sm:translate-y-6";
  return index < mid ? `${side} -rotate-6` : `${side} rotate-6`;
}

function PhoneCluster({ project }: { project: Project }) {
  const phones = project.phones;
  if (!phones?.length) return null;
  const alt = `${project.name} app screen`;
  const mid = Math.floor(phones.length / 2);

  return (
    <div className="relative">
      <AccentBloom
        accent={project.accent}
        className="-inset-10 rounded-[3rem] opacity-70"
      />
      <div className="flex items-center justify-center gap-2 sm:gap-5">
        {phones.map((shot, i) => (
          <Phone
            key={shot.src}
            shot={shot}
            alt={alt}
            priority={i === mid}
            className={phoneFrameClass(i, phones.length)}
          />
        ))}
      </div>
    </div>
  );
}

const DETECTIONS: [number, number, number, number, string][] = [
  [70, 90, 92, 132, "HELMET 0.97"],
  [212, 120, 78, 108, "PERSON 0.94"],
  [326, 96, 96, 140, "BOTTLE 0.91"],
];

function SurveillanceArt({ project }: { project: Project }) {
  return (
    <div className="glass relative rounded-2xl p-2.5 sm:p-3">
      <AccentBloom
        accent={project.accent}
        alpha="2e"
        className="-inset-8 rounded-[2rem] opacity-60"
      />
      <div className="relative aspect-16/11 w-full overflow-hidden rounded-xl bg-[#04070d] ring-1 ring-sky-300/10">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(80% 80% at 70% 20%, rgba(56,189,248,0.20), transparent 60%), radial-gradient(70% 70% at 10% 95%, rgba(217,155,60,0.14), transparent 60%)",
          }}
        />
        <svg
          viewBox="0 0 480 330"
          className="relative h-full w-full"
          fill="none"
          aria-hidden
        >
          <defs>
            <linearGradient id="sv" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#7dd3fc" />
            </linearGradient>
          </defs>

          <g stroke="#38bdf8" strokeWidth="0.5" opacity="0.14">
            <GridLines
              vertical={{ count: 12, step: 40, y1: 0, y2: 330 }}
              horizontal={{ count: 9, step: 40, x1: 0, x2: 480 }}
            />
          </g>

          {DETECTIONS.map(([x, y, w, h, label], i) => (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={w}
                height={h}
                stroke="url(#sv)"
                strokeWidth="1.6"
              />
              <rect
                x={x}
                y={y - 15}
                width={w * 0.92}
                height="13"
                rx="2"
                fill="#38bdf8"
                opacity="0.85"
              />
              <text
                x={x + 5}
                y={y - 5}
                fill="#04070d"
                fontSize="8"
                fontFamily="monospace"
              >
                {label}
              </text>
            </g>
          ))}

          <line
            x1="24"
            y1="272"
            x2="456"
            y2="248"
            stroke="#f5efc5"
            strokeWidth="1.4"
            strokeDasharray="7 6"
            opacity="0.5"
          />
          <text
            x="24"
            y="292"
            fill="#f5efc5"
            opacity="0.4"
            fontSize="9"
            fontFamily="monospace"
          >
            LINE CROSSING — ARMED
          </text>

          <g>
            <rect
              x="24"
              y="20"
              width="72"
              height="20"
              rx="10"
              fill="#04070d"
              opacity="0.8"
            />
            <circle cx="38" cy="30" r="4" fill="#ef4444" />
            <text x="50" y="34" fill="#f5efc5" fontSize="9" fontFamily="monospace">
              LIVE
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}

export default function ProjectVisual({ project }: { project: Project }) {
  if (project.shot) return <BrowserFrame project={project} />;
  if (project.phones) return <PhoneCluster project={project} />;
  return <SurveillanceArt project={project} />;
}
