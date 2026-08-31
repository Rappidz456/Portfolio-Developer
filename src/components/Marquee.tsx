import { marquee as defaultItems } from "@/lib/data";

export default function Marquee({
  items = defaultItems,
}: {
  items?: readonly string[];
}) {
  const row = [...items, ...items];

  return (
    <div
      className="relative z-10 overflow-hidden border-y border-cream/[0.07] bg-ink/35 py-5 backdrop-blur-md"
      aria-hidden
    >
      <div
        className="marquee-track"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent 0%, #000 7%, #000 93%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent 0%, #000 7%, #000 93%, transparent 100%)",
        }}
      >
        {row.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="display flex shrink-0 items-center gap-6 px-6 text-xl text-cream/25 sm:gap-8 sm:px-8 sm:text-2xl md:text-3xl"
          >
            {item}
            <span className="text-amber/50 text-base">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
