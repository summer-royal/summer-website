# Book covers

Thumbnails for the Currently reading shelf. Drop a file here and it appears on
the next page load — no component change.

## How the swap works

Each book in `src/data/currentlyReading.ts` names a `coverUrl` pointing into
this folder. Until that file exists the shelf draws the fallback tile — the
title's first letter on the shelf tint — and the same tile takes over if the
image ever 404s, so a missing cover never shows as a broken image.

## What to supply

| book                      | file                              | box (w × h, px) |
| ------------------------- | --------------------------------- | --------------- |
| Algorithms to Live By     | `algorithms-to-live-by.jpg`       | 64 × 96         |
| Revenge of the Tipping Point | `revenge-of-the-tipping-point.jpg` | 64 × 96      |

The tile is `h-24 w-16` and the image is fitted with `object-fit: cover`, so
anything at a normal 2:3 book-jacket ratio lands without cropping. Supply it at
roughly 2× (128 × 192) so it stays sharp on a retina screen.

When the Goodreads feed replaces the stub in `src/lib/goodreads.ts`, covers come
from the feed and this folder is only needed for books the feed has no art for.
