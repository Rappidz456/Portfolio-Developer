import type { HudCardData } from "@/lib/data";
import { cn } from "@/lib/utils";

export function HudCard({
  label,
  chip,
  value,
  note,
  list,
  live,
  className,
}: HudCardData & { className?: string }) {
  return (
    <div className={cn("glass w-full min-w-0 rounded-xl p-3 sm:p-4", className)}>
      <div className="flex min-w-0 items-center justify-between gap-2">
        <span className="eyebrow flex min-w-0 items-center gap-2 text-cream/70">
          {live && <span className="dot dot-live shrink-0" />}
          <span className="truncate">{label}</span>
        </span>
        {chip && (
          <span className="eyebrow max-w-[50%] shrink-0 truncate rounded-md border border-cream/10 bg-white/4 px-1.5 py-1 text-[9px] tracking-[0.1em] text-cream/50">
            {chip}
          </span>
        )}
      </div>

      {value && (
        <div className="cond mt-2.5 text-2xl tracking-tight text-cream">
          {value}
        </div>
      )}
      {note && <p className="mt-0.5 text-xs text-cream/45">{note}</p>}

      {list && (
        <ul className="mt-3 space-y-1.5">
          {list.map((item) => (
            <li
              key={item}
              className="flex items-center gap-2 text-[11px] text-cream/55"
            >
              <span className="text-amber">✓</span>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
