/**
 * The depth scale.
 *
 * The page is a descent. Every visual layer — the background gradient, the text
 * colours, the drifting objects — is positioned on a single axis measured in
 * metres, so that one number decides where a thing sits and how it is coloured.
 *
 * The band edges at 800 m (between Experience and Research) and 1500 m
 * (between Research and Awards) are the fixed points; the rest of the scale is
 * fitted around them.
 *
 * Contrast note: every colour is solved against the gradient at its own
 * position and verified — body text ≥ 4.5:1 at BOTH ends of the run it sits
 * on, object tints ≥ 3:1 against the gradient at their depth.
 *
 * The light→dark crossover still happens in the `descent` band, which carries
 * no body text, because no ink of any colour clears 4.5:1 across the tones in
 * the middle. That band is kept short so Research and Awards stay close
 * together, which makes the water turn faster there than anywhere else. The
 * gradient is one curve down the whole page — see the descent section of
 * styles.css, which is where the colours live.
 */

export type BandId =
  | "hero"
  | "experience"
  | "skills"
  | "research"
  | "descent"
  | "awards"
  | "projects"
  | "clinical"
  | "community"
  | "about"
  | "reading"
  | "footer";

export interface Band {
  id: BandId;
  /** Depth in metres at the top edge of the band. */
  from: number;
  /** Depth in metres at the bottom edge. */
  to: number;
}

/**
 * Ordered top to bottom. Each band's `to` is the next band's `from`.
 *
 * `skills`, `clinical` and `community` were cut out of the bands they sit in
 * rather than appended to the scale: Skills takes the last stretch of what was
 * Experience, and Clinical and Community take the last stretch of what was
 * Projects. The fixed points at 800 m and 1500 m did not move, the water runs
 * the same colours through the same depths as before, and every object keeps
 * the band it was placed in — a cut band is a seam in the page, never in the
 * gradient. Each new band's share of its parent is set to roughly its share of
 * the rendered height, so the water keeps moving at one rate through the seam.
 */
export const BANDS: readonly Band[] = [
  { id: "hero", from: 0, to: 60 },
  { id: "experience", from: 60, to: 689 },
  { id: "skills", from: 689, to: 800 },
  { id: "research", from: 800, to: 1500 },
  { id: "descent", from: 1500, to: 1560 },
  { id: "awards", from: 1560, to: 1750 },
  { id: "projects", from: 1750, to: 1855 },
  { id: "clinical", from: 1855, to: 1877 },
  { id: "community", from: 1877, to: 1900 },
  { id: "about", from: 1900, to: 2050 },
  { id: "reading", from: 2050, to: 2200 },
  { id: "footer", from: 2200, to: 2320 },
];

const BAND_BY_ID = new Map<BandId, Band>(BANDS.map((b) => [b.id, b]));

export function band(id: BandId): Band {
  const found = BAND_BY_ID.get(id);
  if (!found) throw new Error(`Unknown depth band: ${id}`);
  return found;
}

export const SURFACE_DEPTH = 0;
export const MAX_DEPTH = 2320;

/**
 * Past this depth the field empties out: no further objects are placed, so the
 * Reading section and the footer are silent and the page ends on arrival rather
 * than on a cut. Move this one number to change where the quiet starts.
 */
export const QUIET_DEPTH = 2060;

/** Fraction of the way down its own band that a depth sits, clamped to 0..1. */
export function positionInBand(depth: number, id: BandId): number {
  const { from, to } = band(id);
  if (to === from) return 0;
  return Math.min(1, Math.max(0, (depth - from) / (to - from)));
}

/** The band a depth falls in — the last band whose `to` it has not passed. */
export function bandAtDepth(depth: number): Band {
  for (const b of BANDS) {
    if (depth <= b.to) return b;
  }
  const last = BANDS[BANDS.length - 1];
  if (!last) throw new Error("BANDS is empty");
  return last;
}
