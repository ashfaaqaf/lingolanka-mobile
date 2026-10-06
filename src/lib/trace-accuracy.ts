import type { WritingStroke } from "@/data/writing-strokes";

export type TracePoint = { x: number; y: number };
export type TraceAccuracy = {
  score: number;
  coverage: number;
  control: number;
  strokeOrder: number;
  weakest: "coverage" | "control" | "strokeOrder";
};

const distance = (a: TracePoint, b: TracePoint) => Math.hypot(a.x - b.x, a.y - b.y);

function line(from: TracePoint, to: TracePoint, count: number) {
  return Array.from({ length: count }, (_, index) => {
    const t = (index + 1) / count;
    return { x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t };
  });
}

function samplePath(path: string) {
  const tokens = path.match(/[MLCZ]|-?\d+(?:\.\d+)?/g) ?? [];
  const points: TracePoint[] = [];
  let index = 0;
  let current = { x: 0, y: 0 };
  let origin = current;
  let command = "";
  const number = () => Number(tokens[index++]);
  while (index < tokens.length) {
    if (/^[MLCZ]$/.test(tokens[index]!)) command = tokens[index++]!;
    if (command === "M") {
      current = { x: number(), y: number() };
      origin = current;
      points.push(current);
      command = "L";
    } else if (command === "L") {
      const next = { x: number(), y: number() };
      points.push(...line(current, next, 12));
      current = next;
    } else if (command === "C") {
      const first = { x: number(), y: number() };
      const second = { x: number(), y: number() };
      const next = { x: number(), y: number() };
      for (let step = 1; step <= 28; step += 1) {
        const t = step / 28;
        const inverse = 1 - t;
        points.push({
          x:
            inverse ** 3 * current.x +
            3 * inverse ** 2 * t * first.x +
            3 * inverse * t ** 2 * second.x +
            t ** 3 * next.x,
          y:
            inverse ** 3 * current.y +
            3 * inverse ** 2 * t * first.y +
            3 * inverse * t ** 2 * second.y +
            t ** 3 * next.y
        });
      }
      current = next;
    } else if (command === "Z") {
      points.push(...line(current, origin, 12));
      current = origin;
      command = "";
    } else break;
  }
  return points;
}

const proximity = (source: TracePoint[], target: TracePoint[], tolerance: number) => {
  if (!source.length || !target.length) return 0;
  return Math.round(
    (source.filter((point) => target.some((candidate) => distance(point, candidate) <= tolerance))
      .length /
      source.length) *
      100
  );
};

export function scoreTrace(
  strokes: TracePoint[][],
  guide: readonly WritingStroke[],
  width: number,
  height: number
): TraceAccuracy {
  const normalized = strokes.map((stroke) =>
    stroke.map((point) => ({
      x: (point.x * 320) / Math.max(1, width),
      y: (point.y * 320) / Math.max(1, height)
    }))
  );
  const drawn = normalized.flat();
  const expected = guide.map((item) => samplePath(item.d)).flat();
  const coverage = proximity(expected, drawn, 22);
  const control = proximity(drawn, expected, 25);
  const compared = Math.min(normalized.length, guide.length);
  const starts = compared
    ? Array.from({ length: compared }, (_, index) => {
        const start = normalized[index]?.[0];
        return start
          ? Math.max(
              0,
              100 - distance(start, { x: guide[index]!.start[0], y: guide[index]!.start[1] }) * 2.2
            )
          : 0;
      }).reduce((total, value) => total + value, 0) / guide.length
    : 0;
  const count = Math.max(0, 100 - Math.abs(strokes.length - guide.length) * (100 / guide.length));
  const strokeOrder = Math.round(starts * 0.75 + count * 0.25);
  const score = Math.round(coverage * 0.5 + control * 0.3 + strokeOrder * 0.2);
  const dimensions = { coverage, control, strokeOrder };
  const weakest = (Object.keys(dimensions) as Array<keyof typeof dimensions>).reduce(
    (lowest, key) => (dimensions[key] < dimensions[lowest] ? key : lowest)
  );
  return { score, coverage, control, strokeOrder, weakest };
}
