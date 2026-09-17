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
              <Figure />
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
 * Drawn in the order the forms actually overlap, which is the only order that
 * works: the length of her hair goes down *behind* everything, so the raised
 * arm crosses in front of it the way it really would; arms, torso and legs are
 * one closed contour, because separate limbs leave seams; the head sits over
 * the inner arm, which is the licence that keeps the face clear of it; and the
 * hair on her head goes on last, so there is a hairline rather than a bald
 * profile. Get that order wrong and she wears her hair like a cape.
 *
 * The head is read off `public/summer-portrait.png`, which is the only part of
 * her that has to be a likeness. Three things carry it at this size and nothing
 * else does: the weight of hair, its length to about the waist, and the fact
 * that it is lifted several shades at the ends — hence the gradient rather than
 * a flat brown. The hairline sits just above the brow and sweeps back level to
 * the nape; run it up over the crown instead and she reads as balding, which is
 * what the first two cuts did. The brow is the one facial mark allowed to go
 * darker than the rest, because it is the only one still legible at 20px.
 *
 * Coordinates are a 110 × 216 box. Crown at y 35, hips at 118, toes at 208 —
 * a shade over seven heads, which is the proportion a fashion croquis uses and
 * the reason she reads as drawn rather than as an icon.
 */
function Figure() {
  return (
    <svg className="dive-diver-figure" viewBox="0 0 110 216">
      {/* The length of it, behind her. Hidden from the nape to the shoulder by
          the arm in front, which is what makes it read as tucked behind rather
          than laid over. */}
      <defs>
        <linearGradient
          id="dive-hair-grad"
          x1="0"
          y1="34"
          x2="0"
          y2="140"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#5f4130" />
          <stop offset="0.45" stopColor="#7d5540" />
          <stop offset="1" stopColor="#ab7b52" />
        </linearGradient>
      </defs>

      <g className="dive-hair-fall">
        <path
          className="dive-hair-mass"
          d="M54 48C56.2 50.4 59.8 55.2 62.4 60C65.2 65.2 68 70.4 70.2 76.2C72.4 81.8 74 87.4 74.4 93C74.8 97.8 74 102 72.6 106.4C71.4 110.4 70.4 114 70.2 118C70 122 69.2 125.2 67.8 128.6C68.4 123 68.8 117.6 68.8 112.4C68.8 107.4 68.2 102.6 67.2 97.8C66.2 92.8 64.6 88 62.8 83.2C61 78.4 59 73.6 57.2 68.8C55.6 64.4 54.2 60 53.4 55.8C52.8 52.6 52.4 49.8 54 48Z"
        />
        <g className="dive-hair-strands">
          <path d="M56.4 56C59 62 62.2 68.4 64.6 75.2C67.2 82.4 69.2 88.8 70.2 95.6C71.2 102.6 71.2 109.6 70 116.4" />
          <path d="M59.6 60.4C62.4 66.4 65 72.6 67 79.2C69 85.8 70.4 92.4 71.2 99" />
          <path d="M54.8 53.6C56.8 58.6 59 63.8 61 69" />
        </g>
      </g>

      {/* Arms, torso and legs as one contour. The notch at y 78 is the armpit:
          without it the raised arm and the chest fuse into a single slab. The
          arm holds its width down to the wrist and widens again at the hand —
          taper it all the way and the streamline becomes a spike. */}
      <path
        className="dive-figure-skin"
        d="M57 3.8C57 3.8 54.1 8.7 53.6 11.4C53.1 14.1 54.3 16.7 54.2 20.2C54.1 23.7 53.3 28.4 53.1 32.4C52.9 36.4 53 39.6 53 44.2C53.1 48.8 53.3 54.5 53.4 60.2C53.5 65.9 53.8 78.2 53.8 78.2C53.8 78.2 53.3 79 52.4 80.6C51.5 82.2 49.3 85.5 48.6 88C47.9 90.5 47.8 92.9 48 95.5C48.2 98.1 48.9 99.8 49.6 103.5C50.3 107.2 51.6 113.4 52 117.5C52.4 121.6 51.9 124.6 51.8 128C51.7 131.4 51.5 134.7 51.4 138C51.3 141.3 51.1 145 51 148C50.9 151 50.8 153.7 50.8 156C50.8 158.3 50.9 160 51 162C51.1 164 51.4 165.7 51.6 168C51.8 170.3 52.1 173.3 52.4 176C52.7 178.7 52.9 181.5 53.2 184C53.5 186.5 54.3 186.9 54 191C53.7 195.1 51.2 208.5 51.2 208.5C51.2 208.5 54.9 199.9 55.8 197C56.7 194.2 56.3 193.6 56.8 191.4C57.3 189.2 58.2 186.6 59 184C59.8 181.4 61.3 178.7 61.4 176C61.6 173.3 60.2 170.3 59.9 168C59.6 165.7 59.4 164 59.6 162C59.8 160 60.6 158.3 61.2 156C61.8 153.7 62.8 151 63.4 148C64 145 64.4 141.3 64.8 138C65.2 134.7 65.5 131.3 65.8 128C66.1 124.7 66.8 122 66.4 118C66 114 63.5 108 63.2 104C62.9 100 64.4 97 64.6 94C64.8 91 64.3 88.6 64.6 86C64.9 83.4 66.3 82.5 66.6 78.5C66.9 74.5 66.5 67.4 66.2 62C65.9 56.6 65.2 51 64.6 46C64 41 63.3 36.3 62.6 32C61.9 27.7 60.7 23.5 60.4 20.2C60.1 16.9 61.4 14.9 60.8 12.2C60.2 9.5 57 3.8 57 3.8Z"
      />

      {/* Head and neck, laid over the inner arm — the forms overlap that way
          round, and it is what keeps the profile off the arm. */}
      <path
        className="dive-figure-skin"
        d="M48.6 36.2c-4.1 .6-7.1 3.5-8.3 7.5-.9 2.7-1.1 5.2-1.5 7.7-.3 1.9-1.6 3.4-2.4 5-.5 1 .3 1.8 1.4 2 .9 .2 1.1 .9 .7 1.7-.4 .8 .1 1.6 .6 2.2.3 .4 .5 .9 .7 1.4 1 1 2.4 1.9 4.1 2.4 1.6 .5 3.2 .7 4.7 .5.7 4.2 1.5 8.4 2.4 12.6 2.2 2.2 5.8 2.4 8 .2-.8-4.4-1.6-8.8-2.2-13.2.4-3.2.6-6.8.2-10.6-.4-6.2-2-12.2-4.6-16-1.1-1.6-2.4-2.8-4-3Z"
      />

      {/* The suit. A scoop neck and a tank strap over the shoulder, fitted to
          mid-thigh — the black one-piece romper, read in profile. The hem
          curves down because it is wrapping a leg, not ruled across one. */}
      <path
        className="dive-figure-suit"
        d="M50.8 81C51.6 79.3 52.7 77.6 54 76.6C55.3 75.6 57 74.8 58.4 74.8C59.8 74.8 61.5 75.7 62.4 76.6C63.3 77.5 63.7 78.7 64 80.4C64.3 82.1 64.3 85 64.4 87C64.5 89 64.8 90.6 64.6 92.4C64.4 94.2 63.4 96.1 63.2 98C63 99.9 62.9 102 63.2 104C63.5 106 64.5 107.6 65 110C65.5 112.4 66.1 115.6 66.3 118.4C66.5 121.2 66.2 123.8 66 127C65.8 130.2 65.7 135.2 65 137.6C64.3 140 63.2 140.7 61.6 141.4C60 142.1 57.1 142.2 55.4 141.6C53.7 141 51.8 140.1 51.2 137.8C50.6 135.5 51.7 131.3 51.8 128C51.9 124.7 52 121.2 51.8 118C51.6 114.8 51 111.4 50.6 109C50.2 106.6 49.9 105.2 49.6 103.4C49.3 101.6 48.8 99.7 48.6 98C48.4 96.3 48.1 95.3 48.2 93.4C48.3 91.5 48.6 88.7 49 86.6C49.4 84.5 50 82.7 50.8 81Z"
      />
      <g className="dive-figure-seam">
        <path d="M51.6 81.4c1.6-3.8 5.4-5.2 8.4-4" />
        <path d="M58.6 76.4c1.4 8.2.6 16-.2 23.8-.6 6.4-.2 11.8.4 17.8" />
      </g>

      {/* The hair on her head, last, so there is a hairline. */}
      <g className="dive-hair-cap">
        <path
          className="dive-hair-mass"
          d="M39.8 47.2C39.6 43.4 40.8 39.2 43 36.6C45.4 33.8 48.4 32.2 51.6 32C54.6 31.8 57.2 33.2 59.2 35.2C61.2 37.2 62.6 40.1 63.4 43.3C64.2 46.5 64.4 50 64.2 53.4C64 57 63.2 60.8 62.2 64.4C61.5 66.9 60.6 69.2 60.6 69.2C58.8 65.4 58 62 58 62C57.4 59.4 57.2 57 56.6 54.4C55.9 51.4 54.4 48.6 52.2 46.8C50.2 45.2 47.8 44.4 45.4 44.4C43.6 44.4 42 45.2 41 46C40.4 46.4 39.9 46.8 39.8 47.2Z"
        />
        <g className="dive-hair-strands">
          <path d="M43.8 43C46.8 40.4 50.4 38.8 54 38.8C57 38.8 59.6 40.4 61.2 43.2" />
          <path d="M45.6 36.6C48.8 34.8 52.4 34.2 55.8 35.4C58.8 36.4 61.2 38.8 62.6 42" />
          <path d="M52 44.6C54.6 46 56.6 48.4 57.8 51.6C58.8 54.2 59.2 57 59.2 59.8" />
        </g>
      </g>

      {/* The far arm and the hands, which are the difference between two arms
          in a streamline and one flat blade. */}
      <g className="dive-figure-detail">
        <path d="M56.6 8.2c.3 5.8.7 12.8 1.1 19.8.3 4 .5 6.6.7 8.6" />
        <path d="M54.2 19.8c2.2-1 4.6-.8 6.4.2" />
        <path d="M41.2 52.8c1.2-.6 2.3-.5 3.2.2" />
        <path d="M38.9 60.8c1.2.5 2.4.4 3.4 0" />
      </g>

      {/* Last, and darker than the rest of the face: the brow is the feature
          that survives being 20px tall, and hers is the strong straight kind
          that a lighter mark would lose entirely. */}
      <path className="dive-figure-brow" d="M40.5 49.6c1.5-.9 3.1-.8 4.3.3" />
    </svg>
  );
}
