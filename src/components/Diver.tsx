import type { CSSProperties } from "react";

/**
 * The dive, end to end.
 *
 * It has to finish inside the tide's own crossing: the water reaches the top
 * of the screen at about 5s and the page changes under it there, so the whole
 * figure — board, flight, entry, spray — is spent before then.
 *
 * It is about a third of the speed it was drawn at. Nothing else needed
 * touching for that: every stop in the CSS is a percentage of this number, and
 * the entry is pinned to a *fraction* of the tide rather than to a moment, so
 * changing the tide and the dive by the same factor lands her on exactly the
 * same water. Changing one alone is what breaks it.
 *
 * DIVE_MS reaches the stylesheet as a custom property, the way TIDE_MS does,
 * so the timings in CSS cannot drift from the one here.
 */
const DIVE_MS = 2666;

/**
 * Summer going in off the board, small, on the right.
 *
 * The point of it is that it is the *same* water. The tide's crest is a known
 * curve — the sheet runs 102% of the viewport down to -104% on a bezier over
 * TIDE_MS — and reading that curve back gives the moment the water passes any
 * given depth. The sheet's own top edge is not the waterline, though: the foam
 * is painted inside a 300px crest box and, once the sheet is flipped, its
 * readable surface sits about a third of the way into that box, some 100px
 * below the edge the curve describes. Miss that and she lands on bare sand
 * with the wave still under her, which is exactly what the first cut did.
 *
 * Corrected, the surface crosses 76svh at the same quarter of the tide across
 * every plausible viewport — a fixed pixel offset on top of a proportional
 * sweep barely moves, which is the happy accident that makes this pinnable at
 * all. So the entry is
 * 76svh at 66.7% of DIVE_MS and she goes in *through* the foam. `--dive-water`
 * and DIVE_MS are a pair; move one and she dives onto dry sand.
 *
 * Everything else follows from that. The board sits a figure's height above
 * where she starts, the fall is however far is left between the two, and the
 * spray is wherever the rotation has carried her hands by the time she
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
              {/* A photograph, cut out, not a drawing — at this size the
                  likeness is carried by real skin and hair rather than by any
                  facial mark, and a drawn figure read as a cartoon of her.
                  Three things about the file are load-bearing:

                  Where she sits in it. The frame is 574 x 1128, which is the
                  110 x 216 the flight was built against at twice the largest
                  `--diver-h`, so she is still sharp on a dense screen at full
                  size. She is anchored
                  in it exactly as the drawing was: fingertips at 1.76% of the
                  height, hips at 54.63%, toes at 96.30%. `--dive-fall` gets
                  her to the foam by subtracting `--diver-h * 1.08` on the
                  assumption that she turns about hips at 55% and finishes with
                  her hands that far below the box, so a re-crop that moves any
                  of those three lands her short of the water or through it.

                  How she is lit. Flat and even, because `dive-diver-spin`
                  turns her a full half revolution: a figure lit from above
                  reads as lit from below the moment she is head-down.

                  Where her hair is. Down her back in the file, which is up and
                  trailing once she has turned over. The drawn version swung it
                  from the nape mid-flight; a flat image cannot, so it has to
                  be trailing to begin with. */}
              <img
                className="dive-diver-figure"
                src="/diver.png"
                width={574}
                height={1128}
                alt=""
                draggable={false}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="dive-diver-spray" aria-hidden="true" data-print="hide" style={vars}>
        <svg viewBox="0 0 160 80">
          <g className="dive-spray-burst">
            <ellipse className="dive-spray-ring" cx="80" cy="40" rx="27" ry="7.5" />
            <ellipse
              className="dive-spray-ring dive-spray-ring-inner"
              cx="80"
              cy="40"
              rx="14"
              ry="4"
            />
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
