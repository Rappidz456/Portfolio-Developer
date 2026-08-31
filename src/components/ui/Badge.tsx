import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const variants = {
  glass:
    "glass eyebrow inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-cream/70",
  outline:
    "eyebrow inline-flex items-center gap-2 rounded-full border border-cream/12 bg-white/4 px-3 py-1.5 text-cream/60",
} as const;

export function Badge({
  children,
  live,
  variant = "glass",
  className,
}: {
  children: ReactNode;
  live?: boolean;
  variant?: keyof typeof variants;
  className?: string;
}) {
  return (
    <span className={cn(variants[variant], className)}>
      <span className={cn("dot", live && "dot-live")} />
      {children}
    </span>
  );
}
