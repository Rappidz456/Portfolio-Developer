import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Sections are transparent so the fixed <Backdrop /> and the 3D layer show
 * through. "ink" adds a barely-there translucent band instead of a black slab —
 * see the feathered veil below.
 */
const tones = {
  void: "",
  ink: "",
} as const;

const VEIL =
  "linear-gradient(180deg, transparent 0%, rgba(245,239,197,0.03) 14%, rgba(245,239,197,0.03) 86%, transparent 100%)";

const paddings = {
  default: "page-x py-20 sm:py-24 md:py-32 lg:py-40",
  compact: "page-x py-20 sm:py-24 md:py-28 lg:py-36",
  contact: "page-x py-24 sm:py-28 md:py-36 lg:py-44",
  none: "",
} as const;

export function Section({
  id,
  tone = "void",
  padding = "default",
  className,
  children,
}: {
  id?: string;
  tone?: keyof typeof tones;
  padding?: keyof typeof paddings;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative overflow-hidden",
        tones[tone],
        paddings[padding],
        className
      )}
    >
      {tone === "ink" && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: VEIL }}
        />
      )}
      {children}
    </section>
  );
}

export function Container({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("relative z-10 mx-auto w-full max-w-[1400px]", className)}>
      {children}
    </div>
  );
}

export const HEADING_SIZES = {
  hero: "text-[clamp(1.85rem,9.2vw,3.35rem)] md:text-[clamp(2.75rem,6.8vw,5.4rem)] xl:text-[clamp(4.4rem,6.2vw,7.6rem)] leading-[0.86]",
  about:
    "text-[clamp(2.15rem,8.5vw,3.5rem)] md:text-[clamp(2.8rem,6.2vw,4.8rem)] xl:text-[clamp(3.6rem,5.4vw,5.6rem)] leading-[0.86]",
  work: "text-[clamp(2.05rem,8vw,3.3rem)] md:text-[clamp(2.6rem,5.8vw,4.4rem)] xl:text-[clamp(3.4rem,5vw,5.2rem)] leading-[0.88]",
  section:
    "text-[clamp(2.05rem,8vw,3.3rem)] md:text-[clamp(2.5rem,5.4vw,4rem)] xl:text-[clamp(3.2rem,4.6vw,4.6rem)] leading-[0.86]",
  compact:
    "text-[clamp(1.85rem,7vw,2.9rem)] md:text-[clamp(2.3rem,5vw,3.6rem)] xl:text-[clamp(3rem,4.4vw,4.6rem)] leading-[0.86]",
  contact:
    "text-[clamp(2.2rem,9vw,3.6rem)] md:text-[clamp(3rem,7vw,5rem)] xl:text-[clamp(4.2rem,6.4vw,6.2rem)] leading-[0.84]",
} as const;

export function DisplayHeading({
  as: Tag = "h2",
  size = "section",
  className,
  children,
}: {
  as?: "h1" | "h2" | "h3";
  size?: keyof typeof HEADING_SIZES;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      className={cn(
        "display max-w-full text-cream",
        HEADING_SIZES[size],
        className
      )}
    >
      {children}
    </Tag>
  );
}
