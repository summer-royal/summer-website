import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";

import type { WorkPhoto } from "@/data/work";
import { useDepth } from "./depth/DepthContext";
import { Rise, RiseItem } from "./depth/Rise";

/**
 * Seconds for one frame-height of width to pass. Speed is set per unit of width
 * rather than per loop, so adding a photograph lengthens the loop instead of
 * hurrying every frame along to fit it in.
 */
const SECONDS_PER_ASPECT = 6;

/**
 * The narrowest a run may be, in frame-heights. A run has to be wider than the
 * reel itself — 65rem at most, a little under five frame-heights at the desktop
 * height — or the loop shows an empty stretch before it comes round. A short
 * list is repeated until it clears this.
 */
const MIN_RUN = 6;

/** How long an arrow takes to carry the reel to the next set, in milliseconds. */
const STEP_MS = 650;

/** The fade at either end of the reel, as a share of its width — the mask in styles.css. */
const FADE = 0.06;

/** Fetch the clips this far ahead of the viewport, so they are already running. */
const CLIP_MARGIN = "200px 0px 200px 0px";

type Direction = -1 | 1;

interface Edge {
  left: number;
  right: number;
}

/**
 * Whether the reel is within a margin of the viewport. Observed on the reel
 * rather than on each frame: the frames are always moving, and a clip that
 * stood down every time it slid out of the side of the reel would start over
 * from its first frame each time it came round.
 */
function useNearViewport(ref: RefObject<HTMLElement | null>): boolean {
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) setNear(entry.isIntersecting);
      },
      { rootMargin: CLIP_MARGIN },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return near;
}

/**
 * Where the reel comes to rest after one step, as the distance the track has
 * moved left. A set is whatever shows clear of the fades. Forward, the first
 * frame not wholly in view becomes the first of the set; back, the last frame
 * not wholly in view becomes the last of it, and the set then starts on a
 * frame's left edge. A frame too wide for the view is passed a view at a time.
 */
function stepTarget(x: number, view: number, inset: number, edges: Edge[], direction: Direction) {
  const clear = view - 2 * inset;

  if (direction === 1) {
    const cut = edges.find((edge) => edge.right > x + view - inset + 1);
    const target = cut ? cut.left - inset : x + clear;
    return target > x + 1 ? target : x + clear;
  }

  const cut = [...edges].reverse().find((edge) => edge.left < x + inset - 1);
  if (!cut) return x - clear;
  const end = cut.right - (view - inset);
  const start = edges.find((edge) => edge.left >= end + inset - 1);
  const target = start ? start.left - inset : end;
  return target < x - 1 ? target : x - clear;
}

/**
 * One photograph on the reel. An echo is a repeat, there only to keep the reel
 * full: it is hidden from assistive technology so each photograph is announced
 * once, and it stands down entirely under prefers-reduced-motion.
 *
 * A clip plays silently in its frame while `play` holds, and is its poster
 * otherwise — so a visitor who never reaches the reel, or who asked for
 * stillness, never fetches the video at all.
 */
function Frame({ photo, echo, play }: { photo: WorkPhoto; echo: boolean; play: boolean }) {
  const { caption, bold } = photo;
  // Where the bold words fall in the caption. Not found, it is set plain.
  const at = bold ? caption.indexOf(bold) : -1;

  return (
    <figure
      className="work-reel-item"
      style={{ "--aspect": photo.aspect } as CSSProperties}
      data-echo={echo ? "" : undefined}
      aria-hidden={echo || undefined}
    >
      <div className="work-reel-frame">
        {photo.video && play ? (
          <video
            src={photo.video}
            poster={photo.src}
            aria-label={photo.alt}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            draggable={false}
          />
        ) : (
          <img src={photo.src} alt={photo.alt} decoding="async" draggable={false} />
        )}
      </div>
      <figcaption className="work-reel-caption">
        {bold && at !== -1 ? (
          <>
            {caption.slice(0, at)}
            <strong className="work-reel-bold">{bold}</strong>
            {caption.slice(at + bold.length)}
          </>
        ) : (
          caption
        )}
      </figcaption>
    </figure>
  );
}

/**
 * Photographs passing slowly right to left under a section heading on their
 * own, with arrows either side to step back or on a set. Experience and
 * Hospital Work each hand it their own list; an empty list renders nothing.
 *
 * The run is laid out twice and the track slides left by exactly one run before
 * starting again, so the second copy is always where the first began and the
 * join never shows. The loop is a CSS animation, so it is running the moment
 * the page paints and costs the compositor a transform and nothing more.
 *
 * An arrow does not fight that animation: it seeks it, easing its clock to the
 * moment the next set is lined up, and the reel carries on from there. Under
 * prefers-reduced-motion there is no animation to seek, so the arrow scrolls
 * the strip instead.
 */
export function WorkReel({ photos }: { photos: WorkPhoto[] }) {
  const reelRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  // The step in progress, so a second press starts from where the first is headed.
  const stepping = useRef<{ frame: number; to: number } | null>(null);
  const { mode, armed } = useDepth();
  const near = useNearViewport(reelRef);

  if (photos.length === 0) return null;

  const play = armed && mode !== "reduced" && near;
  const width = photos.reduce((sum, photo) => sum + photo.aspect, 0);
  const repeats = Math.ceil(MIN_RUN / width);
  const run = Array.from({ length: repeats }, () => photos).flat();
  const track = [...run, ...run];
  const seconds = width * repeats * SECONDS_PER_ASPECT;

  function step(direction: Direction) {
    const reel = reelRef.current;
    const strip = trackRef.current;
    if (!reel || !strip) return;

    const items = Array.from(strip.children as HTMLCollectionOf<HTMLElement>).filter(
      (item) => item.offsetWidth > 0,
    );
    const origin = items[0]?.offsetLeft ?? 0;
    const edges = items.map((item) => ({
      left: item.offsetLeft - origin,
      right: item.offsetLeft - origin + item.offsetWidth,
    }));
    const view = reel.clientWidth;

    const animation = strip
      .getAnimations()
      .find((a) => a instanceof CSSAnimation && a.animationName === "work-reel-pass");

    if (!animation) {
      reel.scrollTo({ left: stepTarget(reel.scrollLeft, view, 0, edges, direction) });
      return;
    }

    const loopMs = seconds * 1000;
    const runPx = strip.offsetWidth / 2;
    let from = Number(animation.currentTime ?? 0);
    const aim = stepping.current?.to ?? from;
    if (stepping.current) cancelAnimationFrame(stepping.current.frame);

    // Measure back steps a loop along, so there is always a set to the left.
    const loopStart = loopMs * (Math.floor(aim / loopMs) - (direction === 1 ? 0 : 1));
    const x = ((aim - loopStart) / loopMs) * runPx;
    const target = stepTarget(x, view, view * FADE, edges, direction);
    let to = loopStart + (target / runPx) * loopMs;

    // Before zero the animation has not started and would not draw; a loop on
    // looks identical.
    if (Math.min(from, to) < 0) {
      from += loopMs;
      to += loopMs;
    }

    const began = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - began) / STEP_MS));
      animation.currentTime = from + (to - from) * (1 - (1 - t) ** 3);
      stepping.current = t < 1 ? { frame: requestAnimationFrame(tick), to } : null;
    };
    stepping.current = { frame: requestAnimationFrame(tick), to };
  }

  return (
    // Moving photographs have no place on a printed résumé.
    <div data-print="hide" className="mb-14 sm:mb-16">
      <Rise>
        <RiseItem>
          <div
            className="work-reel-shell"
            style={{ "--reel-seconds": `${seconds}s` } as CSSProperties}
          >
            <div ref={reelRef} className="work-reel">
              <div ref={trackRef} className="work-reel-track">
                {track.map((photo, index) => (
                  <Frame key={index} photo={photo} echo={index >= photos.length} play={play} />
                ))}
              </div>
            </div>
            <button
              type="button"
              className="work-reel-arrow"
              data-side="prev"
              aria-label="Previous photographs"
              onClick={() => step(-1)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M14.5 5.5 8 12l6.5 6.5" />
              </svg>
            </button>
            <button
              type="button"
              className="work-reel-arrow"
              data-side="next"
              aria-label="Next photographs"
              onClick={() => step(1)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M9.5 5.5 16 12l-6.5 6.5" />
              </svg>
            </button>
          </div>
        </RiseItem>
      </Rise>
    </div>
  );
}
