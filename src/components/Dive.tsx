import { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";

import { useTide } from "./Tide";
import { useDepth } from "./depth/DepthContext";

/** The page on the far side of the waterline, which opens on Experience. */
const OCEAN_PATH = "/dive";

/**
 * How long the beach takes to empty, and how long the dive waits for it.
 *
 * The press clears the sand *and* the cover art above it, and only then does
 * the water come up. It has to be that order: the diver stands at 12svh and
 * the board sits at about 25svh, both of them inside the banner, so with the
 * art still up she springs off a plank planted in the Main Quad.
 *
 * It reaches the stylesheet as `--beach-clear`, so the fades cannot fall out
 * of step with the wait here.
 */
export const CLEAR_MS = 480;

/**
 * When the page changes over, measured from the moment the tide is raised.
 *
 * By then the crest has just reached the top of the screen, so the whole
 * viewport is under water and the beach gives way to Experience beneath it
 * rather than in front of the reader. Read off the curve of
 * `dive-tide-sweep` in styles.css; move it if that curve moves.
 */
const SWAP_MS = 2666;

/**
 * The waterline between the beach and the rest of the site, and the only way
 * across it.
 *
 * The beach is a page of its own with nothing below it, so a reader cannot
 * scroll on into Experience — they go in by pressing this. The press empties
 * the beach, then raises the tide and changes the page under it; the tide
 * lives above both pages, so it carries on draining over the one it delivered
 * the reader to.
 *
 * The button is a real link to that page, so it works before hydration and
 * with no JavaScript at all, and a modified click still opens a new tab the
 * way any link would. Everything here is an upgrade laid over that link.
 *
 * `onDive` fires only on the animated path: under prefers-reduced-motion the
 * press goes straight across, so there is no wash to clear the sand for.
 */
export function DiveButton({ onDive }: { onDive?: () => void }) {
  const { mode } = useDepth();
  const raiseTide = useTide();
  const navigate = useNavigate();
  const timersRef = useRef<number[]>([]);

  useEffect(
    () => () => {
      timersRef.current.forEach(clearTimeout);
    },
    [],
  );

  const dive = useCallback(() => {
    // Already going in: a second press has nothing left to do.
    if (timersRef.current.length > 0) return;

    const cross = () => {
      navigate({ to: OCEAN_PATH });
    };

    if (mode === "reduced") {
      cross();
      return;
    }

    // The beach clears, then the water comes up, and the page changes under
    // it — one press, and all three are on the same clock. The tide is held
    // back the length of the clearing rather than started with it, which is
    // what leaves the dive a bare beach to happen on.
    onDive?.();
    timersRef.current.push(
      window.setTimeout(raiseTide, CLEAR_MS),
      window.setTimeout(cross, CLEAR_MS + SWAP_MS),
    );
  }, [mode, navigate, onDive, raiseTide]);

  return (
    <a
      className="dive-button"
      href={OCEAN_PATH}
      onClick={(e) => {
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        dive();
      }}
    >
      {/* A pointer mid-click, ahead of the words. The beach is a page of
          writing with one thing on it to press, and a reader who has been
          reading rather than clicking can take the stamp for a heading —
          this says, before the sentence does, that it is a button. The taps
          it beats out are on the ring's clock, so the cursor reads as the
          thing making the rings rather than as a second animation. */}
      <svg className="dive-button-cursor" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M9.4 9.4 20.6 13.7l-4.4 1.3-1.3 4.4z" />
        <path d="M14 4.1 12 6M5.1 8 2.2 7.2M6 12l-1.9 2M7.2 2.2 8 5.1" />
      </svg>
      Let&rsquo;s Dive In!
      <svg className="dive-button-arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 4.5v14m0 0 5.5-5.5M12 18.5 6.5 13" />
      </svg>
    </a>
  );
}
