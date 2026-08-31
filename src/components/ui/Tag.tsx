import { cn } from "@/lib/utils";

export const TAG_CLASS =
  "rounded-md border border-cream/10 bg-white/4 px-2.5 py-1 text-[10px] tracking-wide text-cream/55";

export function Tag({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return <span className={cn(TAG_CLASS, className)}>{children}</span>;
}

export function TagList({
  items,
  as = "div",
  className,
  tagClassName,
}: {
  items: readonly string[];
  as?: "div" | "ul";
  className?: string;
  tagClassName?: string;
}) {
  const listClass = cn("flex flex-wrap gap-1.5", className);

  if (as === "ul") {
    return (
      <ul className={listClass}>
        {items.map((item) => (
          <li key={item} className={cn(TAG_CLASS, tagClassName)}>
            {item}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className={listClass}>
      {items.map((item) => (
        <Tag key={item} className={tagClassName}>
          {item}
        </Tag>
      ))}
    </div>
  );
}
