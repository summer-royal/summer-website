# Photographs

The travel photographs. Twenty of them, hung on the wall at the foot of the
About section — three of which also drift in the gutter beside the About prose
on a wide viewport.

They are ordinary photographs rather than illustrations, so the field draws them
differently from everything in `../objects`: matted, never blurred, and
near-solid at every depth, with the place printed underneath.

## The manifest

`src/data/travel.ts` is the one list: file, alt text, city, country, and the
file's own ratio. Both presentations read from it, so a caption or a ratio is
only ever written once.

`gutter: true` marks the three that also drift in the About gutter. Their
placement — depth, x, tilt, size — lives beside every other drifting object in
`src/data/objects.ts`, which builds them from this manifest.

## Adding one

Drop a file here and add a row to `src/data/travel.ts`. Encode it the way the
rest were:

```sh
sips -Z 1100 -s format jpeg -s formatOptions 58 SOURCE.JPG --out public/photos/name.jpg
```

Then set `aspect` to the file's own width ÷ height. The frame takes that ratio,
so nothing is ever cropped — a portrait stays a portrait and a landscape stays a
landscape, and the wall reads as a set of prints rather than a grid of tiles.

Two things to watch, because `sips` gets both wrong on its own:

- **Rotation.** `sips -g pixelWidth` reports the stored size, not the displayed
  one. If a photograph has an EXIF orientation, rotate the pixels (`sips -r 90`
  or `-r 270`) so that stored and displayed agree.
- **Metadata.** `sips` keeps the original orientation tag even after rotating,
  which would have the browser turn the photograph a second time. Strip EXIF
  entirely — which also takes the camera and GPS data off a photograph bound for
  a public site.

## Where they sit

The wall is a column layout: two columns below 640px, three to 1024px, four
above it. The number of columns is a media query rather than a measurement, so
the wall is laid out correctly on the server and does not move when hydration
lands.

The three gutter prints fall down the left half of the About column, under the
portrait that anchors the top of it — deliberately clear of the prose, because a
near-solid photograph behind body text is unreadable in a way a line drawing is
not. That column is narrow: keep `x` at 22 or below and the drawn width under
about 170px, which at 1024px still leaves a margin before the prose begins.

Their `depth` is a fraction of the whole About band, and the band now includes
the wall — so a print's depth places it against the section's full height, wall
and all. The three sit between 1934 and 1959, which is the runway between the
bottom of the portrait and the top of the wall. Move the prose or the wall and
those three numbers want re-checking.

Below 1024px there is no gutter at all — the prose takes the full width — so
`styles.css` stands those slots down and the wall shows all twenty instead.
