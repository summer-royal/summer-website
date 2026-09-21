import { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";

import { useTide } from "./Tide";
import { useDepth } from "./depth/DepthContext";

/** The page on the far side of the waterline, which opens on Experience. */
const OCEAN_PATH = "/dive";

/**
 * When the page changes over, measured from the press.
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
 * scroll on into Experience — they go in by pressing this. The press raises
 * the tide and changes the page under it; the tide lives above both pages, so
 * it carries on draining over the one it delivered the reader to.
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
  const swapRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (swapRef.current !== null) clearTimeout(swapRef.current);
    },
    [],
  );

  const dive = useCallback(() => {
    // Already going in: a second press has nothing left to do.
    if (swapRef.current !== null) return;

    const cross = () => {
      navigate({ to: OCEAN_PATH });
    };

    if (mode === "reduced") {
      cross();
      return;
    }

    // The beach clears, the water comes up, and the page changes under it —
    // one press, and all three are on the same clock.
    onDive?.();
    raiseTide();
    swapRef.current = window.setTimeout(cross, SWAP_MS);
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
      Let&rsquo;s Dive In!
      <svg className="dive-button-arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 4.5v14m0 0 5.5-5.5M12 18.5 6.5 13" />
      </svg>
    </a>
  );
}
