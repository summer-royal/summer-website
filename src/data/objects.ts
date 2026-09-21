import { QUIET_DEPTH, bandAtDepth, type BandId } from "@/lib/depth";
import { placeOf, travelPhoto } from "./travel";

/**
 * Parallax layer. Decides how hard the object counter-scrolls, how much it is
 * blurred back, and how solid it reads — NOT where it sits on the page. A
 * trophy can sit deep on the page and still be drawn with mid-water
 * treatment; `depth` places it, `layer` renders it.
 *
 * Below 768px every surviving object is drawn on `mid` regardless of this
 * value, which is the "single mid layer" the brief asks for.
 */
export type ObjectLayer = "near" | "mid" | "deep";

export interface DriftObject {
  /** Stable key, and the text shown on the placeholder until the art lands. */
  id: string;
  /** Illustration path. Missing files fall back to the outlined placeholder. */
  src: string;
  alt: string;
  /** Metres on the page's depth scale — see src/lib/depth.ts. */
  depth: number;
  layer: ObjectLayer;
  /** Horizontal centre, 0–100, as a percentage of the viewport. */
  x: number;
  /** Ambient bob multiplier. 1 is the ~16s baseline; higher is faster. */
  driftSpeed: number;
  /** Resting rotation in degrees. The ambient drift rocks around this. */
  rotation: number;
  /** Size multiplier against the layer's base size. */
  scale: number;

  /* ---- additions to the brief's field list, each earning its place ---- */

  /**
   * Stroke/glow colour. Solved against the background gradient at this
   * object's own depth and verified at ≥3:1, which is what makes an object
   * read on the pale surface AND in the dark. Shallow objects are inked,
   * deep ones are luminous. Replace freely — but re-check the contrast.
   */
  tint: string;
  /** width ÷ height. Only used to size the placeholder box so the composition
   *  can be judged before the real art exists; real art keeps its own ratio. */
  aspect: number;
  /** Survives into the reduced single-layer field below 768px. */
  compact: boolean;

  /**
   * A photograph rather than line art. Photographs are matted and cropped to
   * fill their frame instead of fitted transparent, and are drawn unblurred and
   * near-solid at every layer — a soft, half-transparent photograph reads as a
   * broken image, not as distance, so a photograph's depth is carried by its
   * parallax rate alone.
   *
   * They also need a column to float down, so they are not placed at a depth in
   * the band at all: they fall in normal flow down whatever is left of the
   * About column under the portrait and the lists — see GutterField. Below
   * 1024px the prose takes the full width, there is no column left, and the
   * wall at the foot of About shows those same prints in the page instead.
   */
  photo?: boolean;
  /** Printed under a photograph, the way a location is noted under a print. */
  caption?: string;
}

/** Placeholder height in px at scale 1, per layer. */
export const LAYER_BASE_SIZE: Record<ObjectLayer, number> = {
  near: 190,
  mid: 150,
  deep: 120,
};

/**
 * How each layer behaves.
 *
 * `parallax` is the vertical travel in px applied across the object's pass
 * through the viewport — near-surface things sweep by fast, deep things barely
 * move, which is what sells the descent. `sway` is the same idea sideways and
 * `roll` the same idea in degrees, both far smaller: an object being carried
 * past you does not only rise, it drifts across and turns as it goes.
 *
 * The three are scaled together per layer, so the whole gesture stays tied to
 * depth — a thing at the surface is shoved about by the water, a thing in the
 * dark is barely touched by it.
 */
export const LAYER_TREATMENT: Record<
  ObjectLayer,
  { parallax: number; sway: number; roll: number; blur: number; opacity: number }
> = {
  near: { parallax: 205, sway: 26, roll: 5, blur: 0, opacity: 0.85 },
  mid: { parallax: 112, sway: 16, roll: 3.4, blur: 0.6, opacity: 0.72 },
  deep: { parallax: 52, sway: 9, roll: 2, blur: 1.4, opacity: 0.6 },
};

/**
 * What a photograph takes instead of its layer's numbers.
 *
 * The blur and the fade are the original reason this exists: a soft,
 * half-transparent photograph of a person reads as a broken image rather than
 * as distance, so a print's depth is carried by how it moves instead.
 *
 * It now sets that movement too, and trades the axes round. A drifting object
 * has open water above and below it; the three prints in the About gutter have
 * the lists fixed above them and the wall fixed below, and only the leftover
 * column between the two. So a print rises less than the layer it sits on would
 * have it rise, and in exchange crosses and rocks further — the room it has is
 * sideways, and rocking is the part that reads as floating anyway.
 *
 * The parallax here is also what sets the gap in styles.css between one gutter
 * print and the next: two of them converge as the scroll passes, and the column
 * has to be loose enough that they never meet.
 */
export const PHOTO_TREATMENT = {
  parallax: 58,
  sway: 20,
  roll: 4.5,
  blur: 0,
  opacity: 0.96,
} as const;

/**
 * A travel photograph, placed in the field.
 *
 * The photograph itself — file, alt text, place, ratio — is read from the
 * travel manifest, so the wall at the foot of About and the gutter beside its
 * prose are always showing the same print described the same way. Only how it
 * hangs is given here, which is the one thing the wall has no use for.
 *
 * `depth` orders these three down the gutter and nothing else: a print falls in
 * the column left under the About text rather than at a depth in the band, so
 * there is no page position to give it. `x` is likewise the band field's, not
 * the gutter's — a print is centred in the column it falls down.
 */
function print(
  id: string,
  place: Pick<DriftObject, "depth" | "driftSpeed" | "rotation" | "scale" | "tint">,
): DriftObject {
  const photo = travelPhoto(id);
  return {
    ...place,
    x: 50,
    id: `photo-${photo.id}`,
    src: photo.src,
    alt: photo.alt,
    layer: "mid",
    aspect: photo.aspect,
    compact: false,
    photo: true,
    caption: placeOf(photo),
  };
}

/**
 * The field, ordered by depth.
 *
 * The top of the page is empty water: nothing drifts past the Hero, Experience,
 * Skills or Research bands, so the whole lit half of the descent opens on the
 * writing alone.
 * Mid-water: a trophy, for the awards it falls beside.
 * Through the About band: three of the travel photographs, falling down the
 * column left under the portrait and the lists that anchor the top of it, and
 * clear of the wall that carries the rest at the foot of the section.
 * Past QUIET_DEPTH: nothing at all.
 */
export const driftObjects: DriftObject[] = [
  {
    id: "trophy",
    src: "/objects/trophy.png",
    alt: "A trophy, for the awards.",
    depth: 1620,
    layer: "mid",
    x: 10,
    driftSpeed: 0.75,
    rotation: -11,
    scale: 0.85,
    tint: "#e9bf2a",
    aspect: 0.76,
    compact: true,
  },
  print("oxford", {
    depth: 1935,
    driftSpeed: 0.5,
    rotation: 4,
    scale: 1.25,
    tint: "#c9a9de",
  }),
  print("tahoe", {
    depth: 1948,
    driftSpeed: 0.62,
    rotation: -6,
    scale: 1.08,
    tint: "#d8a86a",
  }),
  print("lisbon", {
    depth: 1961,
    driftSpeed: 0.45,
    rotation: 5,
    scale: 1.25,
    tint: "#dfa0c4",
  }),
];

/**
 * Objects grouped by the band they fall in, so each section renders its own.
 *
 * Photographs are not among them: they are hung in the About gutter in flow
 * rather than placed at a depth, and `gutterPrints` below is what carries them.
 */
export function objectsInBand(id: BandId, compactOnly: boolean): DriftObject[] {
  return driftObjects.filter(
    (o) =>
      o.photo !== true &&
      o.depth <= QUIET_DEPTH &&
      bandAtDepth(o.depth).id === id &&
      (!compactOnly || o.compact),
  );
}

/** The photographs that fall down the About gutter, in the order they hang. */
export const gutterPrints: DriftObject[] = driftObjects.filter((o) => o.photo === true);
