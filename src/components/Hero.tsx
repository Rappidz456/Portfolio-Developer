"use client";

import { useEffect, useRef } from "react";
import Atmosphere from "./Atmosphere";
import HeroOrb from "./HeroOrb";
import { Badge, ButtonLink, Container, DisplayHeading, HudCard } from "./ui";
import { heroCards, profile, type HudCardData } from "@/lib/data";
import { animateHero } from "@/lib/motion";
import { cn } from "@/lib/utils";

function HudColumn({
  cards,
  className,
}: {
  cards: HudCardData[];
  className?: string;
}) {
  return (
    <div className={cn("pointer-events-none z-10 gap-3", className)}>
      {cards.map((card) => (
        <div key={card.label} className="hero-card">
          <HudCard {...card} />
        </div>
      ))}
    </div>
  );
}

export default function Hero() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    return animateHero(el);
  }, []);

  const mobileCards = [heroCards.left[0], heroCards.right[0]];

  return (
    <section
      id="top"
      ref={root}
      className="page-x relative flex min-h-[100svh] flex-col justify-center overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-24 lg:pt-40 lg:pb-32"
    >
      <Atmosphere />

      <div
        className="hero-orb pointer-events-none absolute left-1/2 top-[50svh] z-0 -translate-x-1/2 -translate-y-1/2"
        aria-hidden
      >
        <div className="relative h-[70vw] w-[70vw] max-h-[620px] max-w-[620px] min-h-[290px] min-w-[290px]">
          <div className="orb-halo" />
          <HeroOrb />
        </div>
      </div>

      <Container className="text-center">
        <Badge live className="hero-badge text-cream/75">
          Available for work
        </Badge>

        <DisplayHeading
          as="h1"
          size="hero"
          className="hero-heading glow-text mx-auto mt-6 lg:mt-8"
        >
          <span className="hero-line block overflow-hidden">
            <span className="block">Build the product</span>
          </span>
          <span className="hero-line block overflow-hidden">
            <span className="block">Ship the future</span>
          </span>
        </DisplayHeading>

        <p className="hero-sub micro mx-auto mt-6 max-w-md text-cream/75 lg:mt-7">
          Full stack engineer shipping scalable web, mobile
          <br className="hidden sm:block" /> and AI products from Lahore.
        </p>

        <div className="hero-cta mt-7 flex w-full flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:flex-wrap">
          <ButtonLink href="#work" glow className="w-full sm:w-auto">
            View my work
          </ButtonLink>
          <ButtonLink
            href={profile.resumeHref}
            variant="ghost"
            target="_blank"
            rel="noopener"
            className="w-full sm:w-auto"
          >
            Download résumé
          </ButtonLink>
        </div>
      </Container>

      <HudColumn
        cards={heroCards.left}
        className="drift-left absolute bottom-[9%] left-[3%] hidden w-[192px] flex-col [@media(min-width:1200px)_and_(min-height:860px)]:flex xl:left-[6%] xl:w-[222px]"
      />
      <HudColumn
        cards={heroCards.right}
        className="drift-right absolute bottom-[9%] right-[3%] hidden w-[192px] flex-col [@media(min-width:1200px)_and_(min-height:860px)]:flex xl:right-[6%] xl:w-[222px]"
      />

      <HudColumn
        cards={mobileCards}
        className="relative mx-auto mt-10 grid w-full max-w-xl grid-cols-1 gap-3 sm:mt-12 sm:grid-cols-2 [@media(min-width:1200px)_and_(min-height:860px)]:hidden"
      />

      <div className="hero-pill relative z-10 mt-8 flex justify-center sm:mt-10 [@media(min-width:1200px)_and_(min-height:860px)]:absolute [@media(min-width:1200px)_and_(min-height:860px)]:inset-x-0 [@media(min-width:1200px)_and_(min-height:860px)]:bottom-8 [@media(min-width:1200px)_and_(min-height:860px)]:mt-0">
        <span className="glass micro inline-flex items-center gap-2.5 rounded-full px-5 py-2.5 text-cream/70">
          <span className="dot" />
          Currently building
        </span>
      </div>
    </section>
  );
}
