import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export function Glow({
  className,
  color = "rgba(217,155,60,0.16)",
  shape = "circle",
  falloff = "70%",
  blur,
  style,
}: {
  className?: string;
  color?: string;
  shape?: string;
  falloff?: string;
  blur?: number;
  style?: CSSProperties;
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute", className)}
      style={{
        background: `radial-gradient(${shape}, ${color}, transparent ${falloff})`,
        ...(blur != null ? { filter: `blur(${blur}px)` } : {}),
        ...style,
      }}
    />
  );
}
