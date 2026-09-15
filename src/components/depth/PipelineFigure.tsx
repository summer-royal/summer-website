import { useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import { animate, motion, useMotionValue, useTransform, type MotionValue } from "motion/react";

import type { PipelineStep } from "@/data/research";
import { useDepth } from "./DepthContext";

/* ------------------------------------------------------------------ *
 * Timing. Every stage owns an equal slice of the figure's 0–1 progress.
 * The arrow in from the previous stage draws across the start of its
 * slice and the stage's own drawing across the rest, so step `i` rests
 * at the end of slice `i` and each Next plays exactly one slice.
 * ------------------------------------------------------------------ */

/** Steps in the first row; the rest wrap to a second. */
const ROW = 4;

/** How long one step takes to draw. */
const STEP_SECONDS = 1.6;

type Span = readonly [number, number];

const stageSlice = (index: number, count: number): Span => [index / count, (index + 1) / count];

/** The arrow in from the previous stage. */
const linkInSpan = ([start, end]: Span): Span => [start, start + (end - start) * 0.3];

/** The stage's own drawing; the first stage has no arrow to wait for. */
const drawSpan = (index: number, [start, end]: Span): Span =>
  index === 0 ? [start, end] : [start + (end - start) * 0.25, end];

/** A slice of a 0–1 progress value, rescaled to its own 0–1. */
function useSub(value: MotionValue<number>, from: number, to: number) {
  return useTransform(value, [from, to], [0, 1], { clamp: true });
}

/* ------------------------------------------------------------------ *
 * Drawing primitives. Coordinates are in each panel's 200 × 100 box.
 * ------------------------------------------------------------------ */

type Tone = "ink" | "soft" | "faint" | "accent";

const TONES: Record<Tone, { color: string; opacity: number }> = {
  ink: { color: "currentColor", opacity: 1 },
  soft: { color: "currentColor", opacity: 0.55 },
  faint: { color: "currentColor", opacity: 0.3 },
  accent: { color: "var(--signal)", opacity: 1 },
};

interface ArtProps {
  t: MotionValue<number>;
}

/** A stroke that draws itself across `span` of the panel's progress. */
function Stroke({
  t,
  span,
  d,
  tone = "ink",
  width = 1,
}: {
  t: MotionValue<number>;
  span: Span;
  d: string;
  tone?: Tone;
  width?: number;
}) {
  const drawn = useSub(t, span[0], span[1]);
  const { color, opacity } = TONES[tone];
  return (
    <motion.path
      d={d}
      stroke={color}
      strokeOpacity={opacity}
      strokeWidth={width}
      strokeLinejoin="round"
      style={{ pathLength: drawn }}
    />
  );
}

/** Fills, dashes and markers, which fade in rather than draw. */
function Reveal({
  t,
  span,
  children,
}: {
  t: MotionValue<number>;
  span: Span;
  children: ReactNode;
}) {
  const shown = useSub(t, span[0], span[1]);
  return <motion.g style={{ opacity: shown }}>{children}</motion.g>;
}

const seg = (x1: number, y1: number, x2: number, y2: number) => `M ${x1} ${y1} L ${x2} ${y2}`;

const box = (x: number, y: number, w: number, h: number, r = 2) =>
  `M ${x + r} ${y} H ${x + w - r} Q ${x + w} ${y} ${x + w} ${y + r} V ${y + h - r} ` +
  `Q ${x + w} ${y + h} ${x + w - r} ${y + h} H ${x + r} Q ${x} ${y + h} ${x} ${y + h - r} ` +
  `V ${y + r} Q ${x} ${y} ${x + r} ${y} Z`;

/** A page with its top-right corner folded over. */
const sheet = (x: number, y: number, w: number, h: number, f = 8) =>
  `M ${x} ${y} H ${x + w - f} L ${x + w} ${y + f} V ${y + h} H ${x} Z ` +
  `M ${x + w - f} ${y} V ${y + f} H ${x + w}`;

const headRight = (x: number, y: number) => `M ${x - 4} ${y - 3} L ${x} ${y} L ${x - 4} ${y + 3}`;
const headDown = (x: number, y: number) => `M ${x - 3} ${y - 4} L ${x} ${y} L ${x + 3} ${y - 4}`;
const diamond = (x: number, y: number, s: number) =>
  `M ${x} ${y - s} L ${x + s} ${y} L ${x} ${y + s} L ${x - s} ${y} Z`;
const tick = (x: number, y: number) => `M ${x} ${y} l 3 3 l 6.5 -7.5`;

/* ------------------------------------------------------------------ *
 * One drawing per stage, in the vocabulary of a methods figure. Ink is
 * what the codes record; the accent is what the notes add.
 * ------------------------------------------------------------------ */

/** 1 — A CONSORT-style flow narrows the database to the cohort; bars summarize who is in it. */
const COMPOSITION = [58, 40, 26, 15, 8];

function CohortArt({ t }: ArtProps) {
  return (
    <>
      <Stroke t={t} span={[0, 0.2]} d={box(12, 8, 80, 18)} />
      <Stroke t={t} span={[0.08, 0.24]} d={seg(20, 17, 70, 17)} tone="faint" />
      <Stroke
        t={t}
        span={[0.18, 0.3]}
        d={`${seg(52, 26, 52, 38)} ${headDown(52, 38)}`}
        tone="soft"
      />
      <Stroke t={t} span={[0.22, 0.34]} d={seg(52, 31, 92, 31)} tone="faint" />
      <Reveal t={t} span={[0.3, 0.42]}>
        <path
          d={box(92, 25, 18, 12, 1.5)}
          stroke="currentColor"
          strokeOpacity={0.5}
          strokeDasharray="2 2"
        />
      </Reveal>
      <Stroke t={t} span={[0.28, 0.46]} d={box(20, 39, 64, 18)} />
      <Stroke t={t} span={[0.36, 0.5]} d={seg(28, 48, 66, 48)} tone="faint" />
      <Stroke
        t={t}
        span={[0.46, 0.56]}
        d={`${seg(52, 57, 52, 69)} ${headDown(52, 69)}`}
        tone="soft"
      />
      <Reveal t={t} span={[0.56, 0.7]}>
        <path d={box(30, 70, 44, 20)} fill="var(--signal)" fillOpacity={0.16} />
      </Reveal>
      <Stroke t={t} span={[0.54, 0.72]} d={box(30, 70, 44, 20)} tone="accent" width={1.4} />
      <Stroke t={t} span={[0.62, 0.76]} d={seg(38, 80, 64, 80)} tone="soft" />
      <Stroke t={t} span={[0.86, 1]} d={tick(80, 80)} tone="accent" width={1.4} />

      <Stroke t={t} span={[0.44, 0.58]} d={seg(126, 10, 126, 90)} tone="soft" />
      {COMPOSITION.map((length, i) => (
        <Reveal key={length} t={t} span={[0.56 + i * 0.07, 0.7 + i * 0.07]}>
          <path
            d={box(126, 14 + i * 15, length, 9, 1)}
            fill="currentColor"
            fillOpacity={0.5 - i * 0.08}
            stroke="currentColor"
            strokeOpacity={0.6}
            strokeWidth={0.8}
          />
        </Reveal>
      ))}
    </>
  );
}

/**
 * 2 — Patient timelines from the start of chemotherapy. Coded diagnoses
 * inside the three-month window pick out the subcohort, whose notes are then
 * read against the codes.
 */
const TIMELINES = [18, 34, 50, 66, 82];
const CODED = [
  { y: 18, x: 50, inWindow: true },
  { y: 50, x: 58, inWindow: true },
  { y: 66, x: 90, inWindow: false },
];
const SUBCOHORT_NOTE = [30, 24, 32, 20, 28, 16, 26];

function SubcohortArt({ t }: ArtProps) {
  return (
    <>
      <Reveal t={t} span={[0, 0.18]}>
        <rect x={36} y={8} width={30} height={84} fill="currentColor" fillOpacity={0.07} />
        <path
          d={seg(36, 8, 36, 92)}
          stroke="currentColor"
          strokeOpacity={0.55}
          strokeDasharray="2 2"
        />
      </Reveal>
      {TIMELINES.map((y, i) => (
        <Stroke
          key={y}
          t={t}
          span={[0.04 + i * 0.05, 0.28 + i * 0.05]}
          d={seg(12, y, 104, y)}
          tone={CODED.some((c) => c.inWindow && c.y === y) ? "ink" : "faint"}
        />
      ))}
      {CODED.map(({ y, x, inWindow }, i) => (
        <Reveal key={y} t={t} span={[0.32 + i * 0.06, 0.42 + i * 0.06]}>
          <path
            d={diamond(x, y, 3.5)}
            fill={inWindow ? "currentColor" : "none"}
            stroke="currentColor"
            strokeOpacity={inWindow ? 1 : 0.55}
          />
        </Reveal>
      ))}

      <Stroke t={t} span={[0.4, 0.56]} d="M 144 18 V 10 H 188 V 82 H 180" tone="faint" />
      <Stroke t={t} span={[0.44, 0.64]} d={sheet(136, 18, 44, 72)} />
      {SUBCOHORT_NOTE.map((w, i) => (
        <Stroke
          key={34 + i * 8}
          t={t}
          span={[0.52 + i * 0.02, 0.66 + i * 0.02]}
          d={seg(142, 34 + i * 8, 142 + w, 34 + i * 8)}
          tone="faint"
        />
      ))}

      <Stroke t={t} span={[0.66, 0.84]} d="M 106 18 C 124 18, 122 42, 140 42" tone="accent" />
      <Stroke t={t} span={[0.7, 0.88]} d="M 106 50 C 124 50, 122 58, 140 58" tone="accent" />
      <Stroke t={t} span={[0.84, 0.96]} d={seg(142, 42, 166, 42)} tone="accent" width={1.6} />
      <Stroke t={t} span={[0.88, 1]} d={seg(142, 58, 162, 58)} tone="accent" width={1.6} />
    </>
  );
}

/**
 * 3 — Evidence spans in a note pass through the model. Every record comes out
 * labeled, including cases no code recorded, and a physician signs off on each.
 */
const LLM_NOTE = [34, 28, 36, 24, 32, 20, 30];
const LAYER_Y = [34, 45, 56, 67];
const OUTPUT = [
  { y: 18, kind: "coded" },
  { y: 38, kind: "found" },
  { y: 58, kind: "found" },
  { y: 78, kind: "negative" },
] as const;

function LabelArt({ t }: ArtProps) {
  const edges = LAYER_Y.flatMap((a) => LAYER_Y.map((b) => seg(89, a, 109, b))).join(" ");
  return (
    <>
      <Stroke t={t} span={[0, 0.18]} d={sheet(10, 14, 46, 72)} />
      {LLM_NOTE.map((w, i) => (
        <Stroke
          key={26 + i * 8}
          t={t}
          span={[0.06 + i * 0.02, 0.2 + i * 0.02]}
          d={seg(16, 26 + i * 8, 16 + w, 26 + i * 8)}
          tone="faint"
        />
      ))}
      <Reveal t={t} span={[0.2, 0.32]}>
        <path d={box(13, 38, 40, 8, 1)} fill="var(--signal)" fillOpacity={0.2} />
        <path d={box(13, 62, 40, 8, 1)} fill="var(--signal)" fillOpacity={0.2} />
      </Reveal>

      <Stroke
        t={t}
        span={[0.28, 0.38]}
        d={`${seg(60, 50, 72, 50)} ${headRight(72, 50)}`}
        tone="soft"
      />
      <Stroke t={t} span={[0.32, 0.5]} d={box(76, 24, 46, 54, 3)} />
      <Reveal t={t} span={[0.4, 0.56]}>
        <path d={edges} stroke="currentColor" strokeOpacity={0.28} strokeWidth={0.6} />
        {LAYER_Y.map((y) => (
          <g key={y}>
            <circle cx={89} cy={y} r={2.2} fill="currentColor" />
            <circle cx={109} cy={y} r={2.2} fill="currentColor" />
          </g>
        ))}
      </Reveal>
      <Stroke
        t={t}
        span={[0.52, 0.6]}
        d={`${seg(124, 50, 134, 50)} ${headRight(134, 50)}`}
        tone="soft"
      />

      {OUTPUT.map(({ y, kind }, i) => (
        <Reveal key={y} t={t} span={[0.58 + i * 0.06, 0.7 + i * 0.06]}>
          <path
            d={box(140, y - 4, 8, 8, 1.5)}
            fill={
              kind === "negative" ? "none" : kind === "found" ? "var(--signal)" : "currentColor"
            }
            stroke={kind === "found" ? "var(--signal)" : "currentColor"}
            strokeOpacity={kind === "negative" ? 0.5 : 1}
          />
          <path
            d={seg(154, y, 172, y)}
            stroke="currentColor"
            strokeOpacity={kind === "negative" ? 0.3 : 0.55}
          />
        </Reveal>
      ))}
      {OUTPUT.filter((row) => row.kind !== "negative").map(({ y }, i) => (
        <Stroke
          key={y}
          t={t}
          span={[0.8 + i * 0.06, 0.9 + i * 0.05]}
          d={tick(177, y - 1)}
          tone="accent"
          width={1.4}
        />
      ))}
    </>
  );
}

/** 4 — Coded and newly found cases merge into one patient-by-feature matrix. */
const HEAT = [
  [0.5, 0.12, 0.34, 0.08, 0.22, 0.44],
  [0.18, 0.42, 0.1, 0.3, 0.52, 0.14],
  [0.4, 0.24, 0.56, 0.12, 0.08, 0.36],
  [0.1, 0.48, 0.2, 0.38, 0.28, 0.06],
  [0.3, 0.08, 0.46, 0.16, 0.4, 0.26],
];
const MATRIX = { x: 88, y: 12, cellW: 16.5, cellH: 15.2, cols: 6, rows: 5 };

function FeatureArt({ t }: ArtProps) {
  const { x, y, cellW, cellH, cols, rows } = MATRIX;
  const grid = [
    ...Array.from({ length: cols - 1 }, (_, c) =>
      seg(x + (c + 1) * cellW, y, x + (c + 1) * cellW, y + rows * cellH),
    ),
    ...Array.from({ length: rows - 1 }, (_, r) =>
      seg(x, y + (r + 1) * cellH, x + cols * cellW, y + (r + 1) * cellH),
    ),
  ].join(" ");

  return (
    <>
      <Reveal t={t} span={[0, 0.14]}>
        <path d={diamond(14, 28, 3.5)} fill="currentColor" stroke="currentColor" />
        <path d={diamond(14, 72, 3.5)} fill="var(--signal)" stroke="var(--signal)" />
      </Reveal>
      <Stroke t={t} span={[0.08, 0.34]} d="M 20 28 C 44 28, 46 50, 64 50" />
      <Stroke t={t} span={[0.12, 0.38]} d="M 20 72 C 44 72, 46 50, 64 50" tone="accent" />
      <Reveal t={t} span={[0.32, 0.4]}>
        <circle cx={67} cy={50} r={2.6} fill="currentColor" />
      </Reveal>
      <Stroke
        t={t}
        span={[0.36, 0.46]}
        d={`${seg(72, 50, 83, 50)} ${headRight(83, 50)}`}
        tone="soft"
      />

      <Stroke t={t} span={[0.3, 0.48]} d={box(x, y, cols * cellW, rows * cellH, 1.5)} />
      <Stroke t={t} span={[0.38, 0.54]} d={grid} tone="faint" width={0.7} />
      {HEAT.map((row, r) => (
        <Reveal key={r} t={t} span={[0.44 + r * 0.08, 0.58 + r * 0.08]}>
          {row.map((shade, c) => (
            <rect
              key={c}
              x={x + c * cellW}
              y={y + r * cellH}
              width={cellW}
              height={cellH}
              fill="currentColor"
              fillOpacity={shade}
            />
          ))}
        </Reveal>
      ))}
      <Stroke
        t={t}
        span={[0.86, 1]}
        d={box(x + 2 * cellW - 1.5, y - 3, cellW + 3, rows * cellH + 6, 1.5)}
        tone="accent"
        width={1.4}
      />
    </>
  );
}

/**
 * 5 — Predicted risk over time from the start of chemotherapy. The high-risk
 * patient crosses the threshold inside the three-month window.
 */
function ModelArt({ t }: ArtProps) {
  return (
    <>
      <Stroke t={t} span={[0, 0.2]} d="M 22 10 V 86 H 190" />
      <Stroke
        t={t}
        span={[0.12, 0.26]}
        d="M 60 86 v 3 M 98 86 v 3 M 136 86 v 3 M 174 86 v 3 M 22 48 h -3"
        tone="soft"
      />
      <Reveal t={t} span={[0.18, 0.32]}>
        <rect x={36} y={10} width={84} height={76} fill="currentColor" fillOpacity={0.06} />
        <path
          d={seg(36, 10, 36, 86)}
          stroke="currentColor"
          strokeOpacity={0.55}
          strokeDasharray="2 2"
        />
      </Reveal>
      <Reveal t={t} span={[0.28, 0.42]}>
        <path
          d={seg(22, 42, 190, 42)}
          stroke="currentColor"
          strokeOpacity={0.45}
          strokeDasharray="3 3"
        />
      </Reveal>
      <Stroke t={t} span={[0.3, 0.64]} d="M 22 85 C 80 84, 130 77, 190 70" tone="soft" />
      <Stroke
        t={t}
        span={[0.38, 0.84]}
        d="M 22 84 C 60 82, 78 40, 110 30 S 170 20, 190 18"
        tone="accent"
        width={1.5}
      />
      <Reveal t={t} span={[0.84, 1]}>
        <path
          d={seg(88, 46, 88, 86)}
          stroke="var(--signal)"
          strokeOpacity={0.6}
          strokeDasharray="2 2"
        />
        <circle cx={88} cy={42.4} r={3} fill="var(--signal)" />
      </Reveal>
    </>
  );
}

/** 6 — Precision–recall curves for competing models, and a confusion matrix. */
const CONFUSION = [
  { x: 128, y: 20, fill: "var(--signal)", opacity: 0.32 },
  { x: 158, y: 20, fill: "currentColor", opacity: 0.08 },
  { x: 128, y: 50, fill: "currentColor", opacity: 0.08 },
  { x: 158, y: 50, fill: "currentColor", opacity: 0.24 },
];

function EvaluateArt({ t }: ArtProps) {
  return (
    <>
      <Stroke t={t} span={[0, 0.2]} d="M 14 10 V 88 H 108" />
      <Reveal t={t} span={[0.16, 0.3]}>
        <path
          d={seg(14, 80, 106, 80)}
          stroke="currentColor"
          strokeOpacity={0.4}
          strokeDasharray="3 3"
        />
      </Reveal>
      <Stroke t={t} span={[0.22, 0.54]} d="M 14 32 C 38 46, 62 66, 104 80" tone="faint" />
      <Stroke t={t} span={[0.3, 0.62]} d="M 14 22 C 46 28, 74 48, 104 80" tone="soft" />
      <Stroke
        t={t}
        span={[0.38, 0.72]}
        d="M 14 16 C 56 16, 88 26, 104 80"
        tone="accent"
        width={1.5}
      />

      <Stroke
        t={t}
        span={[0.5, 0.66]}
        d="M 134 14 H 152 M 164 14 H 182 M 122 26 V 44 M 122 56 V 74"
        tone="faint"
      />
      {CONFUSION.map((cell, i) => (
        <Reveal key={`${cell.x}-${cell.y}`} t={t} span={[0.58 + i * 0.08, 0.7 + i * 0.08]}>
          <rect
            x={cell.x}
            y={cell.y}
            width={30}
            height={30}
            fill={cell.fill}
            fillOpacity={cell.opacity}
          />
        </Reveal>
      ))}
      <Stroke
        t={t}
        span={[0.54, 0.74]}
        d={`${box(128, 20, 60, 60, 1.5)} M 158 20 V 80 M 128 50 H 188`}
      />
    </>
  );
}

/**
 * 7 — A forest plot of hazard ratios against HR = 1, and a decision curve
 * standing in for clinical impact.
 */
const UNITY = 72;
const HAZARDS = [
  { y: 16, label: 22, est: 94, lo: 84, hi: 106, size: 4.5 },
  { y: 28, label: 16, est: 86, lo: 66, hi: 104, size: 3.5 },
  { y: 40, label: 20, est: 70, lo: 60, hi: 82, size: 3 },
  { y: 52, label: 14, est: 58, lo: 50, hi: 67, size: 4 },
  { y: 64, label: 22, est: 80, lo: 66, hi: 96, size: 3 },
  { y: 76, label: 18, est: 100, lo: 90, hi: 114, size: 3.5 },
];

/** Raised risk in the accent, protective in ink, an interval that crosses 1 recedes. */
function hazardTone({ lo, hi }: { lo: number; hi: number }): Tone {
  if (lo > UNITY) return "accent";
  if (hi < UNITY) return "ink";
  return "soft";
}

function InterpretArt({ t }: ArtProps) {
  return (
    <>
      {HAZARDS.map(({ y, label }, i) => (
        <Stroke
          key={y}
          t={t}
          span={[0.04 + i * 0.03, 0.18 + i * 0.03]}
          d={seg(10, y, 10 + label, y)}
          tone="faint"
        />
      ))}
      <Stroke
        t={t}
        span={[0, 0.18]}
        d="M 40 88 H 120 M 52 88 v 3 M 72 88 v 3 M 92 88 v 3 M 112 88 v 3"
        tone="soft"
      />
      <Reveal t={t} span={[0.1, 0.24]}>
        <path
          d={seg(UNITY, 8, UNITY, 88)}
          stroke="currentColor"
          strokeOpacity={0.55}
          strokeDasharray="2 2"
        />
      </Reveal>
      {HAZARDS.map((row, i) => {
        const tone = hazardTone(row);
        const from = 0.2 + i * 0.07;
        return (
          <g key={row.y}>
            <Stroke
              t={t}
              span={[from, from + 0.12]}
              d={`${seg(row.lo, row.y, row.hi, row.y)} M ${row.lo} ${row.y - 2} v 4 M ${row.hi} ${row.y - 2} v 4`}
              tone={tone}
            />
            <Reveal t={t} span={[from + 0.06, from + 0.16]}>
              <rect
                x={row.est - row.size / 2}
                y={row.y - row.size / 2}
                width={row.size}
                height={row.size}
                fill={TONES[tone].color}
                fillOpacity={TONES[tone].opacity}
              />
            </Reveal>
          </g>
        );
      })}

      <Stroke t={t} span={[0.5, 0.66]} d="M 136 12 V 88 H 190" tone="soft" />
      <Reveal t={t} span={[0.6, 0.74]}>
        <path
          d={seg(136, 78, 190, 78)}
          stroke="currentColor"
          strokeOpacity={0.4}
          strokeDasharray="3 3"
        />
      </Reveal>
      <Stroke t={t} span={[0.62, 0.8]} d="M 136 22 L 176 88" tone="faint" />
      <Stroke
        t={t}
        span={[0.72, 0.96]}
        d="M 136 20 C 152 22, 170 44, 190 76"
        tone="accent"
        width={1.5}
      />
    </>
  );
}

const ILLUSTRATIONS: Record<string, ComponentType<ArtProps>> = {
  cohort: CohortArt,
  subcohort: SubcohortArt,
  "llm-labels": LabelArt,
  features: FeatureArt,
  model: ModelArt,
  evaluate: EvaluateArt,
  interpret: InterpretArt,
};

/* ------------------------------------------------------------------ *
 * Panels. Each stage is one bordered panel holding its drawing, its
 * number and its text, so nothing has to be matched up across a gap.
 * ------------------------------------------------------------------ */

type StageState = "done" | "active" | "upcoming";

function StepPanel({
  step,
  index,
  count,
  progress,
  state,
}: {
  step: PipelineStep;
  index: number;
  count: number;
  progress: MotionValue<number>;
  /** Upcoming panels are hidden by the stylesheet until the walkthrough reaches them. */
  state: StageState;
}) {
  const [drawFrom, drawTo] = drawSpan(index, stageSlice(index, count));
  // The arrow out of this panel belongs to the start of the next stage.
  const [linkFrom, linkTo] = linkInSpan(stageSlice(index + 1, count));
  const draw = useSub(progress, drawFrom, drawTo);
  const link = useSub(progress, linkFrom, linkTo);
  const linkClip = useTransform(link, (v) => `inset(0 ${(1 - v) * 100}% 0 0)`);

  const Art = ILLUSTRATIONS[step.id];
  const endsRow = index === ROW - 1 || index === count - 1;

  return (
    <li
      className="pipeline-panel"
      data-step={index}
      data-state={state}
      aria-current={state === "active" ? "step" : undefined}
    >
      {Art && (
        <div className="pipeline-art" aria-hidden="true">
          <svg viewBox="0 0 200 100" fill="none">
            <Art t={draw} />
          </svg>
        </div>
      )}
      <p className="pipeline-panel-head">
        <span className="pipeline-index tabular-nums">{index + 1}</span>
        <span className="pipeline-panel-title">{step.label}</span>
      </p>
      <p className="pipeline-panel-note">{step.note}</p>
      {!endsRow && (
        <motion.span className="pipeline-link" aria-hidden="true" style={{ clipPath: linkClip }} />
      )}
    </li>
  );
}

/** The elbow that carries the flow from the end of the first row to the start of the second. */
function ReturnConnector({ progress, count }: { progress: MotionValue<number>; count: number }) {
  const [from, to] = linkInSpan(stageSlice(ROW, count));
  const reveal = useSub(progress, from, to);
  const clip = useTransform(reveal, (v) => `inset(0 0 0 ${(1 - v) * 100}%)`);
  return (
    <motion.div className="pipeline-return" aria-hidden="true" style={{ clipPath: clip }}>
      <span className="pipeline-return-out" />
      <span className="pipeline-return-in" />
    </motion.div>
  );
}

function PipelineSteps({
  steps,
  progress,
  current,
}: {
  steps: PipelineStep[];
  progress: MotionValue<number>;
  /** The stage in hand; everything after it stays hidden. */
  current: number;
}) {
  const panel = (step: PipelineStep, index: number) => (
    <StepPanel
      key={step.id}
      step={step}
      index={index}
      count={steps.length}
      progress={progress}
      state={index < current ? "done" : index === current ? "active" : "upcoming"}
    />
  );

  const rest = steps.slice(ROW);

  return (
    <div className="pipeline-rows">
      <ol className="pipeline-steps">{steps.slice(0, ROW).map((step, i) => panel(step, i))}</ol>
      {rest.length > 0 && (
        <>
          <ReturnConnector progress={progress} count={steps.length} />
          <ol className="pipeline-steps" data-row="2" start={ROW + 1}>
            {rest.map((step, i) => panel(step, ROW + i))}
          </ol>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Presentation
 * ------------------------------------------------------------------ */

/** Room kept clear under the fixed site header, and above the foot of the viewport. */
const SAFE_TOP = 72;
const SAFE_BOTTOM = 16;

/**
 * Scrolls just far enough that the stage in hand and the button that moves it
 * on are both on screen. On a phone the bar already rides the foot of the
 * viewport, so only the panel needs room above it. On a wide screen the button
 * sits in the figure's header, and if the two cannot both fit, the button stays.
 */
function revealStage(figure: HTMLElement | null, index: number, instant: boolean) {
  const panel = figure?.querySelector<HTMLElement>(`[data-step="${index}"]`);
  const bar = figure?.querySelector<HTMLElement>(".pipeline-controls");
  if (!panel || !bar) return;

  const riding = getComputedStyle(bar).position === "sticky";
  const barBox = bar.getBoundingClientRect();
  const panelBox = panel.getBoundingClientRect();
  const top = riding ? panelBox.top : Math.min(barBox.top, panelBox.top);
  const floor = window.innerHeight - (riding ? barBox.height + SAFE_BOTTOM * 2 : SAFE_BOTTOM);

  let delta = 0;
  if (top < SAFE_TOP || panelBox.bottom - top > floor - SAFE_TOP) delta = top - SAFE_TOP;
  else if (panelBox.bottom > floor) delta = panelBox.bottom - floor;
  if (delta !== 0) window.scrollBy({ top: delta, behavior: instant ? "auto" : "smooth" });
}

const ICONS = {
  Next: "M5 12h14 M13 6l6 6-6 6",
  Replay: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8 M3 3v5h5",
} as const;

/**
 * The figure as a walkthrough. Until the reader presses Play, none of it shows:
 * only one large Play control stands in its place. Play draws the first stage,
 * each Next reveals the arrow on and the stage after it, and the last stage
 * offers a replay. A click mid-draw finishes the stage in hand before moving on.
 */
export function PipelineFigure({ steps }: { steps: PipelineStep[] }) {
  const { mode } = useDepth();
  const figureRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const progress = useMotionValue(0);
  const playback = useRef<ReturnType<typeof animate> | null>(null);
  const [current, setCurrent] = useState(-1);

  const count = steps.length;
  const action = current < count - 1 ? "Next" : "Replay";

  useEffect(() => {
    const controls = playback;
    return () => controls.current?.stop();
  }, []);

  // Runs once the new stage is in the DOM. Play swaps the prompt for the
  // figure, so keyboard focus follows onto Next rather than being dropped.
  useEffect(() => {
    if (current < 0) return;
    if (current === 0) buttonRef.current?.focus({ preventScroll: true });
    revealStage(figureRef.current, current, mode === "reduced");
  }, [current, mode]);

  const goTo = (next: number) => {
    const [from, to] = stageSlice(next, count);
    playback.current?.stop();
    progress.set(from);
    if (mode === "reduced") progress.set(to);
    else playback.current = animate(progress, to, { duration: STEP_SECONDS, ease: "easeInOut" });
    setCurrent(next);
  };

  if (current < 0) {
    return (
      <figure className="pipeline-figure" data-print="hide">
        <figcaption className="text-micro tracking-[0.18em] text-sound">PIPELINE</figcaption>
        <button type="button" className="pipeline-prompt" onClick={() => goTo(0)}>
          <span className="pipeline-prompt-disc" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M8 5.5v13l10.5-6.5z" />
            </svg>
          </span>
          <span className="pipeline-prompt-text">
            <span className="pipeline-prompt-title">
              Press play to see the step-by-step pipeline
            </span>
            <span className="pipeline-prompt-note">
              {count} steps, one at a time. Press Next to move on.
            </span>
          </span>
        </button>
      </figure>
    );
  }

  return (
    <figure ref={figureRef} className="pipeline-figure pipeline-stepper" data-print="hide">
      <figcaption className="text-micro tracking-[0.18em] text-sound">PIPELINE</figcaption>
      <PipelineSteps steps={steps} progress={progress} current={current} />
      <p className="sr-only" aria-live="polite">
        Step {current + 1} of {count}: {steps[current]?.label}
      </p>
      <div className="pipeline-controls">
        <div className="pipeline-status" aria-hidden="true">
          <span className="pipeline-progress">
            {steps.map((step, i) => (
              <span key={step.id} data-on={i <= current ? "" : undefined} />
            ))}
          </span>
          <span className="tabular-nums">
            Step {current + 1} of {count}
          </span>
        </div>
        <button
          ref={buttonRef}
          type="button"
          className="pipeline-button"
          aria-label={
            action === "Replay"
              ? "Replay the pipeline from step 1"
              : `Next step: ${steps[current + 1]?.label ?? ""}`
          }
          onClick={() => goTo(action === "Replay" ? 0 : current + 1)}
        >
          {action === "Next" && (
            // Re-keyed on every step, so its pulse waits for the new drawing to finish.
            <span key={current} className="pipeline-button-pulse" aria-hidden="true" />
          )}
          <span className="pipeline-button-text" aria-hidden="true">
            <span className="pipeline-button-kicker">
              <span className="pipeline-button-count tabular-nums">
                {current + 1}/{count} ·{" "}
              </span>
              {action === "Replay" ? "Done" : "Next step"}
            </span>
            <span className="pipeline-button-title">
              {action === "Replay" ? "Replay from step 1" : steps[current + 1]?.label}
            </span>
          </span>
          <span className="pipeline-button-disc" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d={ICONS[action]} />
            </svg>
          </span>
        </button>
      </div>
    </figure>
  );
}
