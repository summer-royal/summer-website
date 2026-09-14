import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "motion/react";

import type { PipelineStep } from "@/data/research";
import { useDepth, usePinProgress } from "./DepthContext";

/* ------------------------------------------------------------------ *
 * Geometry. One coordinate system, four columns, left to right.
 * ------------------------------------------------------------------ */

const VIEW_W = 1120;
const VIEW_H = 420;

/** The note's text lines, and which of them CLEAR will pull out. */
const NOTE_LINES = Array.from({ length: 13 }, (_, i) => ({
  y: 102 + i * 18,
  width: [128, 96, 140, 112, 74, 134, 104, 88, 130, 118, 68, 126, 92][i] ?? 100,
}));
const RETRIEVED = [3, 6, 9, 11];

/** What the model pulls out of those passages, and the clinic checks. */
const EXTRACTED = [
  { field: "CIPN", value: "grade 2" },
  { field: "CRCI", value: "present" },
  { field: "onset", value: "cycle 3" },
];

/** Where each stage owns the pin's 0–1 progress. */
const SPANS = [
  [0.05, 0.27],
  [0.29, 0.51],
  [0.53, 0.75],
  [0.77, 0.97],
] as const;

/** A slice of a stage's 0–1 progress. */
function useSub(value: MotionValue<number>, from: number, to: number) {
  return useTransform(value, [from, to], [0, 1], { clamp: true });
}

/* ------------------------------------------------------------------ *
 * Each moving part is its own component, so every hook sits at the top
 * level of one rather than inside a loop body.
 * ------------------------------------------------------------------ */

function NoteLine({
  index,
  y,
  width,
  kept,
  t1,
  noiseFade,
}: {
  index: number;
  y: number;
  width: number;
  kept: boolean;
  t1: MotionValue<number>;
  noiseFade: MotionValue<number>;
}) {
  // The note fills in top to bottom, the way it would be read.
  const appear = useSub(t1, 0.28 + index * 0.045, 0.42 + index * 0.045);
  return (
    <motion.line
      x1={80}
      y1={y}
      x2={80 + width}
      y2={y}
      stroke={kept ? "var(--pipe-keep)" : "var(--sound)"}
      strokeWidth={kept ? 3 : 2}
      strokeLinecap="round"
      style={{ pathLength: appear, opacity: kept ? appear : noiseFade }}
    />
  );
}

/** One passage CLEAR carries out of the note. */
function RetrievalCurve({
  index,
  fromY,
  t2,
}: {
  index: number;
  fromY: number;
  t2: MotionValue<number>;
}) {
  const draw = useSub(t2, 0.18 + index * 0.08, 0.5 + index * 0.08);
  const toY = 150 + index * 38;
  return (
    <motion.path
      d={`M 232 ${fromY} C 285 ${fromY}, 285 ${toY}, 330 ${toY}`}
      stroke="var(--pipe-keep)"
      strokeWidth={1.25}
      style={{ pathLength: draw }}
    />
  );
}

function RetrievedBar({ index, t2 }: { index: number; t2: MotionValue<number> }) {
  const appear = useSub(t2, 0.6 + index * 0.07, 0.82 + index * 0.07);
  return (
    <motion.rect
      x={350}
      y={144 + index * 38}
      width={130}
      height={11}
      rx={3}
      fill="var(--pipe-keep)"
      style={{ opacity: appear, scaleX: appear, transformOrigin: "350px 0px" }}
    />
  );
}

/** One field the model extracted, and the tick a physician puts against it. */
function LabelRow({
  index,
  field,
  value,
  t4,
}: {
  index: number;
  field: string;
  value: string;
  t4: MotionValue<number>;
}) {
  const y = 140 + index * 60;
  const fan = useSub(t4, index * 0.08, 0.3 + index * 0.08);
  const enter = useSub(t4, 0.24 + index * 0.12, 0.5 + index * 0.12);
  const tick = useSub(t4, 0.52 + index * 0.1, 0.72 + index * 0.1);

  return (
    <g>
      <motion.path
        d={`M 762 210 C 800 210, 810 ${y + 22}, 848 ${y + 22}`}
        stroke="var(--sound)"
        strokeWidth={1.25}
        style={{ pathLength: fan }}
      />
      <motion.g style={{ opacity: enter }}>
        <rect
          x={850}
          y={y}
          width={210}
          height={44}
          rx={4}
          stroke="var(--pipe-keep)"
          strokeWidth={1.25}
          fill="none"
        />
        <text x={868} y={y + 28} className="pipeline-row">
          {field}
          <tspan className="pipeline-row-value"> · {value}</tspan>
        </text>
      </motion.g>
      <motion.path
        d={`M 1018 ${y + 22} l 7 8 l 14 -16`}
        stroke="var(--signal-ink)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ pathLength: tick }}
      />
    </g>
  );
}

/* ------------------------------------------------------------------ *
 * The diagram. Every value descends from one `progress` input, so the
 * same component serves the scroll-driven pin and the still fallback,
 * which simply hands it a constant 1.
 * ------------------------------------------------------------------ */

function PipelineDiagram({ progress }: { progress: MotionValue<number> }) {
  const t1 = useSub(progress, SPANS[0][0], SPANS[0][1]);
  const t2 = useSub(progress, SPANS[1][0], SPANS[1][1]);
  const t3 = useSub(progress, SPANS[2][0], SPANS[2][1]);
  const t4 = useSub(progress, SPANS[3][0], SPANS[3][1]);

  const pageOutline = useSub(t1, 0, 0.4);
  // Everything the retrieval passes over recedes.
  const noiseFade = useTransform(t2, [0, 0.3], [1, 0.14], { clamp: true });
  const clearBox = useSub(t2, 0.42, 0.74);
  const feedArrow = useSub(t3, 0, 0.26);
  const modelBox = useSub(t3, 0.2, 0.56);
  const modelLabel = useSub(t3, 0.5, 0.72);
  const shotLabel = useSub(t3, 0.66, 0.88);
  const seal = useSub(t4, 0.78, 1);

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className="pipeline-svg"
      role="img"
      aria-label="Clinical notes are narrowed by CLEAR retrieval, extracted zero-shot by GPT-4o, and confirmed by physicians into validated labels."
      fill="none"
    >
      {/* ---------- 1. Clinical notes ---------- */}
      <motion.rect
        x={60}
        y={70}
        width={170}
        height={280}
        rx={6}
        stroke="var(--sound)"
        strokeWidth={1.25}
        style={{ pathLength: pageOutline }}
      />
      {NOTE_LINES.map((line, i) => (
        <NoteLine
          key={line.y}
          index={i}
          y={line.y}
          width={line.width}
          kept={RETRIEVED.includes(i)}
          t1={t1}
          noiseFade={noiseFade}
        />
      ))}

      {/* ---------- 2. CLEAR retrieval ---------- */}
      {RETRIEVED.map((lineIndex, i) => {
        const line = NOTE_LINES[lineIndex];
        return line ? <RetrievalCurve key={lineIndex} index={i} fromY={line.y} t2={t2} /> : null;
      })}
      <motion.rect
        x={330}
        y={120}
        width={170}
        height={180}
        rx={6}
        stroke="var(--sound)"
        strokeWidth={1.25}
        style={{ pathLength: clearBox }}
      />
      {RETRIEVED.map((lineIndex, i) => (
        <RetrievedBar key={lineIndex} index={i} t2={t2} />
      ))}

      {/* ---------- 3. GPT-4o extraction ---------- */}
      <motion.path
        d="M 500 210 L 586 210"
        stroke="var(--sound)"
        strokeWidth={1.25}
        style={{ pathLength: feedArrow }}
      />
      <motion.path
        d="M 578 204 L 588 210 L 578 216"
        stroke="var(--sound)"
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ pathLength: feedArrow }}
      />
      <motion.rect
        x={590}
        y={150}
        width={170}
        height={120}
        rx={8}
        stroke="var(--bone)"
        strokeWidth={1.5}
        style={{ pathLength: modelBox }}
      />
      <motion.text
        x={675}
        y={205}
        textAnchor="middle"
        className="pipeline-node"
        style={{ opacity: modelLabel }}
      >
        GPT-4o
      </motion.text>
      <motion.text
        x={675}
        y={228}
        textAnchor="middle"
        className="pipeline-micro"
        style={{ opacity: shotLabel }}
      >
        zero-shot
      </motion.text>

      {/* ---------- 4. Physician-validated labels ---------- */}
      {EXTRACTED.map((row, i) => (
        <LabelRow key={row.field} index={i} field={row.field} value={row.value} t4={t4} />
      ))}
      <motion.g style={{ opacity: seal }}>
        <circle cx={955} cy={352} r={13} stroke="var(--signal-ink)" strokeWidth={1.25} />
        <path
          d="M 949 352 l 4 5 l 8 -10"
          stroke="var(--signal-ink)"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text x={976} y={357} className="pipeline-micro">
          physician-confirmed
        </text>
      </motion.g>
    </svg>
  );
}

/* ------------------------------------------------------------------ *
 * Presentation
 * ------------------------------------------------------------------ */

function StageRail({ steps, active }: { steps: PipelineStep[]; active: number }) {
  return (
    <ol className="pipeline-rail">
      {steps.map((step, i) => (
        <li key={step.id} data-active={i === active ? "true" : undefined}>
          <span className="pipeline-rail-index tabular-nums">{i + 1}</span>
          <span>
            <span className="pipeline-rail-label">{step.label}</span>
            <span className="pipeline-rail-note">{step.note}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}

/**
 * The second pinned moment, and the one place on the page where scrolling does
 * explanatory work rather than decoration: the four stages draw themselves in
 * the order the data actually moves through them.
 *
 * It is a `position: sticky` stage, so the page never stops answering the
 * scroll it is given — flick past and you pass it at full speed, with the
 * diagram simply further along.
 */
function PipelineScrolly({ steps }: { steps: PipelineStep[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pin = usePinProgress(trackRef);
  const [active, setActive] = useState(0);

  // One discrete read for the caption rail: no per-frame React renders.
  useMotionValueEvent(pin, "change", (p) => {
    let next = 0;
    for (let i = 0; i < SPANS.length; i++) {
      const span = SPANS[i];
      if (span && p >= span[0]) next = i;
    }
    setActive((current) => (current === next ? current : next));
  });

  return (
    <figure ref={trackRef} className="pipeline-track" data-print="hide">
      <div className="pipeline-stage">
        <figcaption className="text-micro tracking-[0.18em] text-sound">PIPELINE</figcaption>
        <PipelineDiagram progress={pin} />
        <StageRail steps={steps} active={active} />
      </div>
    </figure>
  );
}

/** Fully drawn, standing still: prefers-reduced-motion on a wide viewport. */
function PipelineStill({ steps }: { steps: PipelineStep[] }) {
  const done = useMotionValue(1);
  return (
    <figure className="pipeline-still">
      <figcaption className="text-micro tracking-[0.18em] text-sound">PIPELINE</figcaption>
      <PipelineDiagram progress={done} />
      <StageRail steps={steps} active={-1} />
    </figure>
  );
}

/** Narrow viewports read the stages as text, at a size that is legible. */
function PipelineList({ steps }: { steps: PipelineStep[] }) {
  return (
    <figure className="mt-10 rounded-md border border-border/70 p-5">
      <figcaption className="text-micro tracking-[0.18em] text-sound">PIPELINE</figcaption>
      <ol className="mt-5 space-y-4">
        {steps.map((step, i) => (
          <li key={step.id} className="flex gap-3">
            <span className="pipeline-rail-index tabular-nums">{i + 1}</span>
            <span>
              <span className="block text-base text-bone">{step.label}</span>
              <span className="block text-fine text-muted-foreground">{step.note}</span>
            </span>
          </li>
        ))}
      </ol>
    </figure>
  );
}

export function PipelineFigure({ steps }: { steps: PipelineStep[] }) {
  const { mode, narrow, armed } = useDepth();

  if (!armed || narrow) return <PipelineList steps={steps} />;
  if (mode !== "full") return <PipelineStill steps={steps} />;
  return <PipelineScrolly steps={steps} />;
}
