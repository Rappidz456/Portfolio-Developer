"use client";

import { useEffect, useMemo, useRef } from "react";
import { animateHighlight } from "@/lib/motion";

/**
 * Scroll-linked word fill: words start dim and light up one by one
 * as the block travels through the viewport.
 */
export default function HighlightText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = useMemo(() => text.split(" "), [text]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return animateHighlight(el);
  }, [text]);

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} data-w className="inline-block opacity-25">
          {word}
          {i < words.length - 1 ? "\u00a0" : ""}
        </span>
      ))}
    </p>
  );
}
