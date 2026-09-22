import { useRef } from "react";
import { motion, useTransform } from "motion/react";

import { placeOf, travelPhotos, type TravelPhoto } from "@/data/travel";
import { useDepth, useElementProgress, useSettled } from "./depth/DepthContext";
import { Rise, RiseItem } from "./depth/Rise";

/**
 * How far a print counter-scrolls, in px, across its own pass through the
 * viewport. Cycled by index so that neighbours never take the same rate and the
 * wall shears gently as it goes by.
 *
 * Two prints in one column can drift towards each other by at most twice the
 * largest number here — 68px — which is what sets the gap between them in
 * styles.css. They can therefore lean together for a whole scroll and still
 * never touch.
 */
const TRAVEL = [34, 18, 28, 14] as const;

/** Resting tilt, degrees — where a print hangs when the scroll is still. */
const TILT = [-1.6, 1.1, -0.8, 1.8, -1.2, 0.9] as const;

/**
 * Sideways drift in px, and the turn in degrees, across the same pass. These
 * are what make a print read as shoved about by the water rather than merely
 * sliding: it crosses, and it rocks, on its way up the screen.
 *
 * Kept small on purpose — the column gaps in styles.css are what they are
 * because of these numbers, and a print that swings too far crosses into its
 * neighbour's column.
 */
const SWAY = [9, 5, 12, 7, 4] as const;
const ROLL = [2.1, 1.2, 2.6, 1.5, 1, 2.3, 1.7] as const;

/**
 * Pick from one of those cycles. Their lengths are 4, 6, 5 and 7 — no two share
 * a factor, so a print repeats its exact combination of rate, tilt, drift and
 * turn only once every 420, which is to say never on a wall of twenty.
 */
function at<T>(values: readonly T[], index: number): T {
  return values[index % values.length] as T;
}

/**
 * One print on the wall.
 *
 * The outer div holds the place in the column layout and never moves — it is
 * also what the pass is measured from, because a box that carried the transform
 * would be measuring its own displacement. Everything that moves is a transform
 * on the two wrappers inside it — the pass on one, the turn on the frame — so a
 * print rocking past its neighbours costs the compositor a matrix and nothing
 * else.
 *
 * Under prefers-reduced-motion nothing is transformed at all and the wall is a
 * plain, still set of photographs.
 *
 * No `will-change` here, deliberately. The drifting objects can afford the hint
 * because they unmount once they are well clear of the viewport, which is what
 * drops it again; these twenty stay mounted for the life of the page, and
 * twenty promoted layers holding full-size photographs is a standing cost
 * for a hint the compositor does not need to animate a transform.
 */
function Print({ photo, index }: { photo: TravelPhoto; index: number }) {
  const { mode, narrow } = useDepth();
  const ref = useRef<HTMLDivElement>(null);
  const pass = useElementProgress(ref);

  // Loosened, so a print trails the scroll and rocks back into place rather
  // than being pinned to it.
  const settled = useSettled(pass);

  const still = mode === "reduced";
  // Narrow viewports are two columns of larger prints with less room to shear,
  // so they take half of everything.
  const room = narrow ? 0.5 : 1;
  const travel = still ? 0 : at(TRAVEL, index) * room;
  const y = useTransform(settled, [0, 1], [travel, -travel], { clamp: true });
  const sway = still ? 0 : at(SWAY, index) * room;
  const x = useTransform(settled, [0, 1], [-sway, sway], { clamp: true });
  const tilt = at(TILT, index);
  const roll = still ? 0 : at(ROLL, index) * room;
  const rotate = useTransform(settled, [0, 1], [tilt - roll, tilt + roll], { clamp: true });

  return (
    <div
      ref={ref}
      className="travel-print"
      // Stood down from 1024px up, where this print falls down the About
      // gutter instead — styles.css holds that media query.
      data-gutter={photo.gutter === true ? "" : undefined}
    >
      <motion.div style={still ? {} : { x, y }}>
        <motion.div
          className="travel-print-frame"
          // The frame takes the file's own ratio, so a print is matted to its
          // photograph rather than the photograph cropped to fit a frame.
          style={
            still
              ? { aspectRatio: String(photo.aspect) }
              : { aspectRatio: String(photo.aspect), rotate }
          }
        >
          <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" />
        </motion.div>
        <p className="travel-print-caption">{placeOf(photo)}</p>
      </motion.div>
    </div>
  );
}

/**
 * The travel photographs, hung at the foot of About.
 *
 * A column layout rather than a grid, so prints of different shapes stack
 * without being cropped to a common box, and so the number of columns is a
 * media query rather than a measurement — the wall is laid out correctly on the
 * server and does not shift when hydration lands.
 *
 * Two of these prints also fall down the gutter beside the About prose from
 * 1024px up, and carry `data-gutter` so that styles.css can stand them down
 * here, so the same photograph is never on screen twice. Below that width
 * there is no gutter and the wall carries all twenty.
 */
export function TravelWall() {
  return (
    // A printed résumé has no use for twenty holiday photographs.
    <div data-print="hide">
      {/* This gap is also the bottom of the runway the two gutter prints
          fall down — they need room to rise and rock clear of both the links
          above them and this wall below. See .about-gutter in styles.css. */}
      <Rise className="mt-24 sm:mt-40">
        <RiseItem as="header">
          <p className="text-micro tracking-[0.18em] text-sound">TRAVEL</p>
        </RiseItem>
        <RiseItem className="travel-wall mt-6 sm:mt-8">
          {travelPhotos.map((photo, index) => (
            <Print key={photo.id} photo={photo} index={index} />
          ))}
        </RiseItem>
      </Rise>
    </div>
  );
}
