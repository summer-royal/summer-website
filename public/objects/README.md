# Drifting objects

Illustrations for the depth field. Drop a file here and it appears on the next
page load — no component change, no manifest edit.

## How the swap works

Each object in `src/data/objects.ts` names a `src` in this folder. Until that
file exists the page draws a labelled dashed outline at the object's real size,
position, rotation and tint, so the composition can be judged before any art is
made. The first time a file 404s the page remembers and stops asking; add the
file and reload and the illustration takes its place.

## What to supply

| id        | file            | box (w × h, px) | tint      |
| --------- | --------------- | --------------- | --------- |
| trophy    | `trophy.png`    | 97 × 128        | `#e9bf2a` |

Boxes are the placeholder size on a desktop viewport (`LAYER_BASE_SIZE × scale`,
with `aspect` giving the width). They are guidance, not a constraint — real art
keeps its own proportions and is fitted with `object-fit: contain`, so only the
ratio matters. Change `scale` or `aspect` in the manifest to re-fit.

SVG is preferred (it stays crisp under the parallax scale and weighs little).
PNG with transparency works too — update the `src` extension in the manifest.

The About band also floats four photographs, which are drawn as prints rather
than as line art and live in `../photos` — see the README there.

## Tints

Each `tint` was solved against the background gradient at that object's own
depth and verified at ≥3:1, which is what lets a shallow object read as ink on
pale water and a deep one read as light in the dark. If you draw art in other
colours, check it against the gradient at its depth — `src/lib/depth.ts` has the
ramp — or keep the art monochrome and let the tint do the work.

## Moving things around

Everything about placement lives in `src/data/objects.ts`:
`depth` puts an object on the page, `layer` decides how it is drawn (parallax
rate, blur, opacity), `x` is its horizontal position, and `compact` says whether
it survives into the reduced field below 768px. Nothing past `QUIET_DEPTH`
renders at all, which is what keeps the bottom of the page silent.
