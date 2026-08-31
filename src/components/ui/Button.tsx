import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-cream text-black transition-transform duration-300 hover:-translate-y-0.5",
  ghost:
    "border border-cream/15 bg-white/4 text-cream/80 backdrop-blur transition-colors hover:bg-white/8 hover:text-cream",
} as const;

const sizes = {
  sm: "rounded-md px-4 py-2.5",
  md: "rounded-lg px-6 py-3.5",
  compact: "rounded-lg px-5 py-3",
} as const;

type Variant = keyof typeof variants;
type Size = keyof typeof sizes;

export function buttonClass({
  variant = "primary",
  size = "md",
  glow,
  className,
}: {
  variant?: Variant;
  size?: Size;
  glow?: boolean;
  className?: string;
} = {}) {
  return cn(
    "eyebrow inline-flex min-h-11 items-center justify-center gap-2",
    variants[variant],
    sizes[size],
    glow && "shadow-[0_0_50px_-8px_rgba(245,239,197,0.5)]",
    className
  );
}

type ButtonLinkProps = ComponentPropsWithoutRef<"a"> & {
  variant?: Variant;
  size?: Size;
  glow?: boolean;
  external?: boolean;
};

export function ButtonLink({
  variant,
  size,
  glow,
  external,
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <a
      className={buttonClass({ variant, size, glow, className })}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    />
  );
}

type TextLinkProps = ComponentPropsWithoutRef<"a"> & {
  external?: boolean;
};

export function TextLink({
  className,
  external,
  children,
  ...props
}: TextLinkProps) {
  return (
    <a
      className={cn(
        "eyebrow link-underline text-cream/45 transition-colors hover:text-cream",
        className
      )}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    >
      {children}
    </a>
  );
}

export function IconButton({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"button"> & { children: ReactNode }) {
  return (
    <button
      type="button"
      className={cn(
        "eyebrow flex min-h-11 items-center gap-2.5 rounded-md border border-cream/12 bg-white/4 px-3.5 py-2.5 text-cream/85 backdrop-blur transition-colors hover:bg-white/8",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
