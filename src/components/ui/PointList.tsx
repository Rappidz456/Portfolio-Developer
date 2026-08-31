import { cn } from "@/lib/utils";

export function PointList({
  items,
  className,
  muted,
}: {
  items: readonly string[];
  className?: string;
  muted?: boolean;
}) {
  return (
    <ul className={cn("space-y-3", className)}>
      {items.map((item) => (
        <li
          key={item}
          className={cn(
            "flex gap-3 text-sm",
            muted ? "text-cream/50" : "text-cream/55"
          )}
        >
          <span className="mt-2 h-px w-4 shrink-0 bg-amber/50" />
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}
