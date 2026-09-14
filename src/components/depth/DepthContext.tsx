import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import {
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  type MotionValue,
} from "motion/react";

/**
 * full    — desktop, motion allowed: parallax, both pins, entry animation.
 * compact — below 768px: one mid layer, fewer objects, no pins.
 * reduced — prefers-reduced-motion: no parallax, no pins, no entry animation.
 *           The depth gradient stays, as static section backgrounds.
 */
export type MotionMode = "full" | "compact" | "reduced";

interface DepthValue {
  /** THE scroll source. Page scroll in px. Every layer derives from this one. */
  scrollY: MotionValue<number>;
  /** The same source, normalised 0–1 across the document. */
  pageProgress: MotionValue<number>;
  mode: MotionMode;
  /**
   * Viewport below 768px. Tracked separately from `mode` because the two are
   * independent: a phone with prefers-reduced-motion is reported as `reduced`,
   * and still needs every narrow-viewport concession.
   */
  narrow: boolean;
  /**
   * False during SSR and the first paint. Nothing hides or animates until it
   * flips, so the page is complete and readable even if the JS never arrives.
   */
  armed: boolean;
  viewport: number;
}

const noopValue = { get: () => 0 } as unknown as MotionValue<number>;

const DepthContext = createContext<DepthValue>({
  scrollY: noopValue,
  pageProgress: noopValue,
  mode: "reduced",
  narrow: false,
  armed: false,
  viewport: 0,
});

export function useDepth(): DepthValue {
  return useContext(DepthContext);
}

const COMPACT_QUERY = "(max-width: 767.98px)";
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

export function DepthProvider({ children }: { children: ReactNode }) {
  const { scrollY, scrollYProgress } = useScroll();
  const [mode, setMode] = useState<MotionMode>("reduced");
  const [narrow, setNarrow] = useState(false);
  const [armed, setArmed] = useState(false);
  const [viewport, setViewport] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia(REDUCED_QUERY);
    const compact = window.matchMedia(COMPACT_QUERY);

    const sync = () => {
      setMode(reduced.matches ? "reduced" : compact.matches ? "compact" : "full");
      setNarrow(compact.matches);
      setViewport(window.innerHeight);
    };

    sync();
    setArmed(true);

    reduced.addEventListener("change", sync);
    compact.addEventListener("change", sync);
    window.addEventListener("resize", sync, { passive: true });
    return () => {
      reduced.removeEventListener("change", sync);
      compact.removeEventListener("change", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);

  const value = useMemo<DepthValue>(
    () => ({ scrollY, pageProgress: scrollYProgress, mode, narrow, armed, viewport }),
    [scrollY, scrollYProgress, mode, narrow, armed, viewport],
  );

  return <DepthContext.Provider value={value}>{children}</DepthContext.Provider>;
}

/**
 * An element's own 0–1 pass across the viewport, derived from the shared scroll
 * value rather than from a scroll listener of its own: 0 as its top edge
 * reaches the bottom of the viewport, 1 as its bottom edge leaves the top. It
 * is centred on screen at 0.5.
 *
 * Measurement is cached and refreshed only on resize, so scrolling costs one
 * arithmetic step per element per frame and never reads layout.
 */
export function useElementProgress(ref: RefObject<HTMLElement | null>): MotionValue<number> {
  const { scrollY } = useDepth();
  const progress = useMotionValue(0);
  const box = useRef({ top: 0, height: 1, viewport: 1 });

  const recompute = useCallback(
    (y: number) => {
      const { top, height, viewport } = box.current;
      const span = height + viewport;
      if (span <= 0) return;
      const raw = (y - (top - viewport)) / span;
      progress.set(raw < 0 ? 0 : raw > 1 ? 1 : raw);
    },
    [progress],
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      box.current = {
        top: rect.top + window.scrollY,
        height: rect.height,
        viewport: window.innerHeight,
      };
      recompute(window.scrollY);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    // An element's own size is not the only thing that moves it. Anything above
    // it on the page growing — a lazy image arriving, a font swapping — changes
    // where it sits without resizing it, and near the foot of a page this long
    // that is easily hundreds of pixels: measured once at mount, an element
    // down in About spends the rest of the session believing its pass is
    // already over and sits at the far end of its travel. Watching the
    // document's own box catches every such shift, and it settles within the
    // first seconds rather than costing anything per frame.
    observer.observe(document.documentElement);
    window.addEventListener("resize", measure, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [ref, recompute]);

  useMotionValueEvent(scrollY, "change", recompute);

  return progress;
}

/**
 * How a scroll-derived value chases the scroll.
 *
 * Deliberately underdamped — ζ ≈ 0.56 — so an object does not track the wheel
 * rigidly. It lags a little behind the scroll, carries slightly past where the
 * scroll left it, and rocks back into place. That overshoot is the whole
 * effect: a critically damped spring here reads as merely smooth, where this
 * reads as something with mass, floating, being pushed around by the water.
 */
const SETTLE = { stiffness: 55, damping: 7, mass: 0.7 } as const;

/**
 * A scroll-derived value, loosened.
 *
 * Under prefers-reduced-motion the value is handed back untouched — the caller
 * is not moving anything at all there, so there is nothing to soften.
 */
export function useSettled(value: MotionValue<number>): MotionValue<number> {
  const { mode } = useDepth();
  const settled = useSpring(value, SETTLE);
  return mode === "reduced" ? value : settled;
}

/**
 * Progress through a sticky pin, 0 at the moment the stage locks to the top of
 * the viewport and 1 at the moment it lets go.
 *
 * The pin is `position: sticky`, so the page keeps scrolling at exactly its
 * normal velocity throughout — this reads the scroll, it never drives it. A
 * visitor who wants the bottom of the page gets there as fast as they can flick.
 */
export function usePinProgress(ref: RefObject<HTMLElement | null>): MotionValue<number> {
  const { scrollY } = useDepth();
  const progress = useMotionValue(0);
  const track = useRef({ top: 0, distance: 1 });

  const recompute = useCallback(
    (y: number) => {
      const { top, distance } = track.current;
      const raw = (y - top) / distance;
      progress.set(raw < 0 ? 0 : raw > 1 ? 1 : raw);
    },
    [progress],
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      track.current = {
        top: rect.top + window.scrollY,
        // The stage is one viewport tall, so what is left is the pinned run.
        distance: Math.max(1, rect.height - window.innerHeight),
      };
      recompute(window.scrollY);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    window.addEventListener("resize", measure, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [ref, recompute]);

  useMotionValueEvent(scrollY, "change", recompute);

  return progress;
}
