import type { CSSProperties } from "react";

/**
 * The dive, end to end.
 *
 * It has to finish inside the tide's own crossing: the water reaches the top
 * of the screen at about 1.6s and the page changes under it there, so the
 * whole figure — board, flight, entry, spray — is spent before then.
 *
 * DIVE_MS reaches the stylesheet as a custom property, the way TIDE_MS does,
 * so the timings in CSS cannot drift from the one here.
 */
const DIVE_MS = 1500;

/**
 * Summer going in off the board, small, on the right.
 *
 * The point of it is that it is the *same* water. The tide's crest is a known
 * curve — 102% of the viewport down to -104% on a cubic-bezier over TIDE_MS —
 * and reading that curve back gives the moment it passes any given depth. It
 * crosses 68svh at almost exactly 1000ms, so the entry is pinned to 68svh at
 * 1000ms and she goes in *through* the foam rather than near it. Move either
 * number and the dive lands on flat water; `--dive-water` and the 66.7% stop
 * in the keyframes are the two places that knowledge lives.
 *
 * Everything else follows from that. The board sits a figure's height above
 * where she starts, the fall is however far is left between the two, and the
 * splash is wherever the rotation has carried her hands by the time she
 * arrives. All of it is expressed against `--diver-h`, so the whole graphic
 * scales with one number.
 *
 * Two layers, because the water has to matter: the board and the figure ride
 * *under* the tide, so the wash genuinely closes over them, and only the spray
 * is lifted above it, since spray is the one thing that is thrown clear.
 */
export function Diver() {
  const vars = { "--dive-ms": `${DIVE_MS}ms` } as CSSProperties;

  return (
    <>
      <div className="dive-diver" aria-hidden="true" data-print="hide" style={vars}>
        <div className="dive-diver-board">
          <svg viewBox="0 0 240 64" preserveAspectRatio="xMaxYMin meet">
            {/* Pivoting about the fulcrum rather than bending: the far end runs
                off the edge of the screen, so the cheat never shows. */}
            <g className="dive-board-flex">
              <path
                className="dive-board-plank"
                d="M32 15.5C30.6 15.6 30 16.6 30 18c0 1.4.6 2.4 2 2.4L238 22.6V12.6Z"
              />
              <g className="dive-board-tread">
                <path d="M44 15.9v4.4M53 15.8v4.4M62 15.7v4.4M71 15.6v4.5M80 15.5v4.5M89 15.4v4.5" />
              </g>
              <path className="dive-board-lip" d="M32 15.5 238 12.6" />
            </g>
            <g className="dive-board-stand">
              <rect x="150" y="21.5" width="23" height="9" rx="4.5" />
              <path d="M155 30.5 152.5 47M168 30.5l2.5 16.5M147 47h27" />
            </g>
          </svg>
        </div>

        {/* Three nested frames so the parabola is real: gravity owns the
            vertical, the push off the board owns the horizontal, and the
            rotation owns neither. One element cannot ease all three apart. */}
        <div className="dive-diver-fall">
          <div className="dive-diver-drift">
            <div className="dive-diver-spin">
              <Figure />
            </div>
          </div>
        </div>
      </div>

      <div className="dive-diver-spray" aria-hidden="true" data-print="hide" style={vars}>
        <svg viewBox="0 0 160 80">
          <g className="dive-spray-burst">
            <ellipse className="dive-spray-ring" cx="80" cy="40" rx="27" ry="7.5" />
            <ellipse className="dive-spray-ring dive-spray-ring-inner" cx="80" cy="40" rx="14" ry="4" />
            <g className="dive-spray-throw">
              <path d="M66 36c-4-8-6-14-7-20M74 34c-2-8-3-14-3.5-21M86 34c2-8 3-14 3.5-21M94 36c4-8 6-14 7-20M58 38c-6-6-10-10-14-14M102 38c6-6 10-10 14-14" />
              <circle cx="59" cy="14.5" r="1.5" />
              <circle cx="70.5" cy="11.5" r="1.3" />
              <circle cx="89.5" cy="11.5" r="1.3" />
              <circle cx="101" cy="14.5" r="1.5" />
              <circle cx="43" cy="23" r="1.2" />
              <circle cx="117" cy="23" r="1.2" />
            </g>
          </g>
        </svg>
      </div>
    </>
  );
}

/**
 * The figure, drawn once and rotated.
 *
 * She is in a streamline the whole way — arms locked overhead, legs together,
 * toes pointed — which is the one pose that is true both standing on the board
 * and head-down at the water. That is what lets a single drawing carry the
 * dive: the flight is nothing but 180 degrees about her hips, and the pose
 * reads correctly at every angle in between. Morphing between a crouch and a
 * flight pose would buy a knee bend and cost the clean line everywhere else.
 *
 * Built as a silhouette rather than as separate limbs: one closed contour for
 * arms, torso and legs, the suit laid over it, then the head and the hair on
 * top of the inner arm — which is the order the forms actually overlap in, and
 * the only order in which the face stays clear of the arms.
 *
 * Coordinates are a 110 × 216 box. Crown at y 36, hips at 118, toes at 212 —
 * about seven and a quarter heads, which is the proportion a fashion croquis
 * uses and the reason the figure reads as drawn rather than as an icon.
 */
function Figure() {
  return (
    <svg className="dive-diver-figure" viewBox="0 0 110 216">
      {/* Arms, torso and legs as one contour. The notch at y 79 is the armpit:
          without it the raised arm and the chest fuse into a single slab. */}
      <path
        className="dive-figure-skin"
        d="M56.5 3.6c-1.8 2-2.8 5.6-3.1 10.2-.4 6.2-.6 14.2-.8 21.2-.2 9-.4 19-.2 27 .2 6 .4 10.6 1 14.2.4 1 .8 2 1 2.6-2.4 2-4.8 5-5.4 9-.4 4 1 9 1.7 13.4.7 4.6 1.3 10 2.3 15.6.4 2.8 0 8.4-.4 13.8-.4 6.6-.9 16.6-.9 26.6 0 8 .7 17 1.6 25 .5 4.4.8 7.4 1.1 9.4-.5 5.6-1.8 13-3.2 20.2 3.2-5.6 6-12.2 7-17 .4-2 0-3-.2-4 2.4-5.6 3.8-13.6 4.3-19 .6-4.6-2.5-8.6-1.7-13.2.8-4.8 3-12.4 4.2-19.2 1.2-6.8 2-14.2 2.2-20.6.2-6.6-2.6-11-3-15.6-.4-4.4 1.2-7.4 1.4-11 .2-4.4 0-9-.8-12.8.4-1.8 1-3.2 1.6-4.6.4-5.6-.2-11.6-.8-17.6-.8-10-1.8-18-2.8-26-.8-8-1.8-14-2.5-18-.6-4.2-2.3-8.2-4.4-10.4Z"
      />

      {/* The suit. A scoop neck and a tank strap over the shoulder, fitted to
          mid-thigh — the black one-piece romper, read in profile. The hem
          curves down because it is wrapping a leg, not ruled across one. */}
      <path
        className="dive-figure-suit"
        d="M50 77.4c3.2-3.8 9.6-4 14.4.6.6 6-.2 10.4.2 15 .2 4-1.6 7-1.4 11.2.3 4.4 3 8.8 3 15.4 0 5.4-.6 11.4-1.4 17.4-4.2 4.8-9.8 4.6-13.4.6.2-6 1.2-13.6.8-20-.6-5.6-1.6-11-2.3-15.6-.7-4.4-2.1-9.4-1.7-13.4.6-4 2.2-7.2 3.4-9.6Z"
      />
      <g className="dive-figure-seam">
        <path d="M51.4 79.2c3-2.8 8.4-3 12.2.4" />
        <path d="M59.4 76.4c1.2 8.6.2 16.6-.6 24.6-.6 6.6-.2 12 .4 18" />
      </g>

      {/* Head and neck, laid over the inner arm — the forms overlap that way
          round, and it is what keeps the profile off the arm. */}
      <path
        className="dive-figure-skin"
        d="M48.6 36.2c-4 .6-7 3.4-8.2 7.4-.8 2.8-1 5.6-1.4 8-.2 1.6-1.6 3-2.2 4.4-.5 1 .1 1.9 1.1 2.2.8.3.9.7.8 1.6-.1 1.2.2 2.2 1 3.2.9 1.1 2.3 2.1 4.1 2.7 1.6.5 3.2.7 4.8.5.6 3.4 1.2 6.8 2 10.2 1.8 2 5 2.2 7 .2-.6-3.6-1.2-7.2-1.6-10.8.4-3.2.6-6.8.2-10.6-.4-6.2-2-12.2-4.6-16-1.1-1.6-2.4-2.8-4-3Z"
      />
      <g className="dive-figure-face">
        <path d="M41.4 51.6c1.2-.7 2.4-.6 3.4.1" />
        <path d="M39.4 60.2c1.1.5 2.2.5 3.2.1" />
      </g>

      {/* The hair. Long, and it falls down her back, which is the same drawing
          standing on the board as it is head-down over the water — a diver
          falling head-first has it streaming off her back either way. The
          strands lift a few degrees into the flight, which is the only part of
          her that the air is allowed to move. */}
      <g className="dive-diver-hair">
        <path
          className="dive-hair-mass"
          d="M41.6 41.4c1.6-4.2 5-7 8.6-7.2 3.6-.2 6.6 2.4 8.8 6.4 2.4 4.4 4.6 9.6 6.4 14.6 2 5.6 5 11.2 6.8 17.4 2 6.8 3.4 14.2 3.8 21.6.4 7-.2 14-1.4 20.2-1.2 6-3 11.2-5.2 15.4 1.2-6 1.8-12.4 1.6-18.8-.2-7.6-1.4-15.2-3.2-22-1.8-6.8-4.2-13-6.2-18.6-1.8-5-3-10.2-4.2-14.8-1.2-4.6-3-8.6-5.6-10.8-2.2-1.8-4.6-2-6.4-.4Z"
        />
        <g className="dive-hair-strands">
          <path d="M50.2 35.2c3.4 1.6 5.8 5.4 7.6 9.8 2 4.8 4 10.2 6 15.4 2.2 5.8 4.6 12 6 18.6 1.4 6.6 2 13.8 1.8 20.6-.2 5.6-.8 11-1.8 15.8" />
          <path d="M45 37c2.6 2.2 4.4 5.6 5.8 9.6 1.6 4.4 3.2 9.4 5 14.4 1.8 5 3.8 10.4 5.2 16 1.4 5.4 2.2 11.2 2.4 16.8" />
          <path d="M56 42.6c2.6 4.6 4.8 10 6.8 15.4 2.2 5.8 4.8 12 6.4 18.4 1.2 4.8 2 9.8 2.2 14.6" />
        </g>
      </g>
    </svg>
  );
}
