"use client";

import { type CSSProperties, useCallback, useEffect, useState } from "react";
import { nav, profile, type NavItem } from "@/lib/data";
import { useEscape, useScrollFlag } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { ButtonLink, IconButton } from "./ui";

function MenuIcon() {
  return (
    <span className="flex flex-col gap-[3px]" aria-hidden>
      <span className="block h-px w-4 bg-current" />
      <span className="block h-px w-3 bg-current" />
      <span className="block h-px w-4 bg-current" />
    </span>
  );
}

function NavLinks({
  items,
  onSelect,
  className,
  itemClassName,
  itemStyle,
}: {
  items: NavItem[];
  onSelect?: () => void;
  className?: string;
  itemClassName?: string;
  itemStyle?: (index: number) => CSSProperties;
}) {
  return (
    <nav className={className}>
      {items.map((item, i) => (
        <a
          key={item.href}
          href={item.href}
          onClick={onSelect}
          className={itemClassName}
          style={itemStyle?.(i)}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}

export default function Nav({ items = nav }: { items?: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const solid = useScrollFlag(40);
  const close = useCallback(() => setOpen(false), []);
  useEscape(close);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1280px)");
    const onChange = () => {
      if (mq.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top,0px)] transition-colors duration-500",
          solid
            ? "border-b border-cream/8 bg-void/70 backdrop-blur-xl"
            : "border-b border-transparent"
        )}
      >
        <div className="page-x mx-auto flex max-w-[1400px] items-center justify-between py-3 sm:py-4 md:py-6">
          <a
            href="#top"
            className="display shrink-0 text-cream text-lg leading-none tracking-tight sm:text-xl md:text-2xl"
          >
            {profile.wordmark}
          </a>

          <NavLinks
            items={items}
            className="hidden items-center gap-6 xl:flex xl:gap-9"
            itemClassName="eyebrow link-underline text-cream/60 transition-colors hover:text-cream"
          />

          <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
            <ButtonLink href="#contact" size="sm" className="px-3 sm:px-4">
              Hire Me
            </ButtonLink>
            <IconButton
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={open}
              className="xl:hidden"
            >
              <MenuIcon />
              <span className="hidden min-[400px]:inline">Menu</span>
            </IconButton>
          </div>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-void/96 pt-[env(safe-area-inset-top,0px)] backdrop-blur-2xl transition-all duration-500 xl:hidden",
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        )}
      >
        <div className="page-x flex h-full flex-col justify-center gap-2">
          <NavLinks
            items={items}
            onSelect={close}
            className="flex flex-col gap-2"
            itemClassName="display text-cream/90 text-[clamp(2.25rem,8vw,3.75rem)] transition-all duration-500 hover:text-cream"
            itemStyle={(i) => ({
              transform: open ? "translateY(0)" : "translateY(20px)",
              opacity: open ? 1 : 0,
              transitionDelay: `${80 + i * 60}ms`,
            })}
          />
          <div className="micro mt-10 max-w-full break-all text-cream/40">
            {profile.location} — {profile.email}
          </div>
        </div>
      </div>
    </>
  );
}
