import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "./utils";

let registered = false;

export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export { prefersReducedMotion };

/** Hero entrance + scroll scatter. Scoped to the hero root. */
export function animateHero(el: HTMLElement) {
  registerGsap();
  const reduced = prefersReducedMotion();

  const ctx = gsap.context(() => {
    if (!reduced) {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.from(".hero-line span", {
        yPercent: 108,
        duration: 1.25,
        stagger: 0.09,
      })
        .from(".hero-badge", { opacity: 0, y: 14, duration: 0.7 }, 0.15)
        .from(".hero-sub", { opacity: 0, y: 20, duration: 0.9 }, 0.5)
        .from(".hero-cta", { opacity: 0, y: 20, duration: 0.9 }, 0.62)
        .from(
          ".hero-card",
          { opacity: 0, y: 26, duration: 0.9, stagger: 0.08 },
          0.75
        );
    }

    if (reduced) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1200px) and (min-height: 860px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });
      tl.to(".hero-badge", { y: -260, opacity: 0 }, 0)
        .to(".hero-heading", { y: -190 }, 0)
        .to(".hero-sub", { x: -460, opacity: 0.25 }, 0)
        .to(".hero-cta", { x: 460, opacity: 0.25 }, 0)
        .to(".hero-orb", { y: 90 }, 0)
        .to(".drift-left", { x: -150, y: -70 }, 0)
        .to(".drift-right", { x: 150, y: -70 }, 0)
        .to(".hero-pill", { y: -120, opacity: 0 }, 0);
    });

    mm.add("(max-width: 1199px), (max-height: 859px)", () => {
      gsap.to(".hero-orb", {
        y: 120,
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    });

    return () => mm.revert();
  }, el);

  return () => ctx.revert();
}

/** Scroll-linked word fill used by HighlightText. */
export function animateHighlight(el: HTMLElement) {
  registerGsap();
  const words = el.querySelectorAll("span[data-w]");

  if (prefersReducedMotion()) {
    gsap.set(words, { opacity: 1 });
    return;
  }

  const ctx = gsap.context(() => {
    gsap.fromTo(
      words,
      { opacity: 0.22 },
      {
        opacity: 1,
        ease: "none",
        stagger: 0.5,
        scrollTrigger: {
          trigger: el,
          start: "top 78%",
          end: "bottom 52%",
          scrub: 0.5,
        },
      }
    );
  }, el);

  return () => ctx.revert();
}
