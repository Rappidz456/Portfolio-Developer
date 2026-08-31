type Vertical = {
  count: number;
  start?: number;
  step: number;
  y1: number;
  y2: number;
};

type Horizontal = {
  count: number;
  start?: number;
  step: number;
  x1: number;
  x2: number;
};

/** SVG grid of vertical + horizontal lines. Stroke is inherited from the parent `<g>`. */
export function GridLines({
  vertical,
  horizontal,
}: {
  vertical: Vertical;
  horizontal: Horizontal;
}) {
  const vx = vertical.start ?? 0;
  const hy = horizontal.start ?? 0;

  return (
    <>
      {Array.from({ length: vertical.count }, (_, i) => {
        const x = vx + i * vertical.step;
        return (
          <line key={`v${i}`} x1={x} y1={vertical.y1} x2={x} y2={vertical.y2} />
        );
      })}
      {Array.from({ length: horizontal.count }, (_, i) => {
        const y = hy + i * horizontal.step;
        return (
          <line
            key={`h${i}`}
            x1={horizontal.x1}
            y1={y}
            x2={horizontal.x2}
            y2={y}
          />
        );
      })}
    </>
  );
}
