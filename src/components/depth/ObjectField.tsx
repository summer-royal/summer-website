import { useEffect, useRef, useState, type RefObject } from "react";
import { motion, useTransform } from "motion/react";

import { positionInBand, type BandId } from "@/lib/depth";
import {
  LAYER_BASE_SIZE,
  LAYER_TREATMENT,
  PHOTO_TREATMENT,
  objectsInBand,
  type DriftObject,
} from "@/data/objects";
import { useDepth, useElementProgress, useSettled } from "./DepthContext";

/** Mount objects this far outside the viewport so nothing pops into view. */
const PRELOAD_MARGIN = "60% 0px 60% 0px";

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
      { rootMargin: PRELOAD_MARGIN },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return near;
}

/**
 * One drifting object.
 *
 * The slot is placed once with `top`/`left` and never animated. Everything that
 * moves is a transform or an opacity: the pass (scroll-driven, and sprung, so
 * the object rises, drifts sideways and turns a little behind the scroll rather
 * than with it) and the ambient bob (a CSS keyframe, so it costs the compositor
 * nothing). Well outside the viewport the whole inner tree unmounts, which also
 * drops `will-change`.
 */
function DriftObjectView({ object, bandId }: { object: DriftObject; bandId: BandId }) {
  const { mode, narrow } = useDepth();
  const slotRef = useRef<HTMLDivElement>(null);
  const near = useNearViewport(slotRef);

  // Below 768px everything collapses onto the single mid layer.
  const layer = narrow ? "mid" : object.layer;
  const treatment = LAYER_TREATMENT[layer];
  const height = LAYER_BASE_SIZE[layer] * object.scale;
  const width = height * object.aspect;

  // A photograph takes its own numbers rather than its layer's — see the note
  // on PHOTO_TREATMENT for why the two differ.
  const isPhoto = object.photo === true;
  const drawn = isPhoto ? PHOTO_TREATMENT : treatment;
  const blur = drawn.blur;

  // 0 as the object enters from the bottom, 0.5 centred, 1 as it leaves the top.
  const pass = useElementProgress(slotRef);
  // Loosened, so the object trails the scroll and rocks back rather than being
  // pinned to it. Everything below rides this except the fade.
  const settled = useSettled(pass);
  const at = positionInBand(object.depth, bandId);

  const still = mode === "reduced";
  const travel = still ? 0 : drawn.parallax;
  const y = useTransform(settled, [0, 1], [travel, -travel], { clamp: true });
  const sway = still ? 0 : drawn.sway;
  const x = useTransform(settled, [0, 1], [-sway, sway], { clamp: true });
  const roll = still ? 0 : drawn.roll;
  const rotate = useTransform(settled, [0, 1], [object.rotation - roll, object.rotation + roll], {
    clamp: true,
  });

  // The fade rides the raw pass, not the spring: these are the edges where the
  // object arrives and leaves, and a value that overshoots them would blink.
  const fade = drawn.opacity;
  const opacity = useTransform(pass, [0, 0.18, 0.82, 1], [0, fade, fade, 0], { clamp: true });

  return (
    <div
      ref={slotRef}
      className="drift-slot"
      data-photo={object.photo}
      style={{
        top: `${at * 100}%`,
        left: `${object.x}%`,
        width,
        height,
        marginLeft: -width / 2,
        marginTop: -height / 2,
      }}
    >
      {near && (
        <motion.div
          className="h-full w-full"
          style={still ? { opacity: fade } : { x, y, opacity, willChange: "transform, opacity" }}
        >
          <div
            className={still ? "h-full w-full" : "drift-bob h-full w-full"}
            style={
              still
                ? undefined
                : { animationDuration: `${16 / Math.max(object.driftSpeed, 0.05)}s` }
            }
          >
            <motion.div
              className="h-full w-full"
              style={
                still
                  ? { rotate: object.rotation, filter: blur > 0 ? `blur(${blur}px)` : undefined }
                  : { rotate, filter: blur > 0 ? `blur(${blur}px)` : undefined }
              }
            >
              <ObjectArt object={object} />
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

/**
 * Illustrations found to be missing, so that an object drifting back into view
 * does not ask for the same absent file again.
 */
const absentArt = new Set<string>();

/** Whether this object's file is still being probed, has landed, or is absent. */
function useArtState(src: string) {
  const [state, setState] = useState<"probing" | "loaded" | "absent">(() =>
    absentArt.has(src) ? "absent" : "probing",
  );

  return {
    state,
    onLoad: () => setState("loaded"),
    onError: () => {
      absentArt.add(src);
      setState("absent");
    },
  };
}

/** The outline that stands exactly where a file will go, at its tint. */
function Placeholder({ object, label }: { object: DriftObject; label: string }) {
  return (
    <div
      className="drift-placeholder"
      data-object-placeholder={object.id}
      style={{ borderColor: object.tint, color: object.tint }}
    >
      <span className="drift-placeholder-label">{label}</span>
    </div>
  );
}

/**
 * The illustration, or a labelled outline standing exactly where it will go.
 *
 * Drop a file at the manifest's `src` and it takes over on the next load — no
 * component change, no manifest edit. Until then the outline holds the real
 * size, position, rotation and tint, which is what makes the composition
 * judgeable before any art exists.
 */
function ObjectArt({ object }: { object: DriftObject }) {
  if (object.photo === true) return <PhotoArt object={object} />;
  return <LineArt object={object} />;
}

function LineArt({ object }: { object: DriftObject }) {
  const { state, onLoad, onError } = useArtState(object.src);

  return (
    <div className="relative h-full w-full">
      {state !== "loaded" && <Placeholder object={object} label={object.id} />}
      {state !== "absent" && (
        <img
          src={object.src}
          alt={object.alt}
          loading="lazy"
          decoding="async"
          onLoad={onLoad}
          onError={onError}
          className="absolute inset-0 h-full w-full object-contain"
          style={{ opacity: state === "loaded" ? 1 : 0 }}
        />
      )}
    </div>
  );
}

/**
 * A photograph in the field: a print rather than an illustration.
 *
 * It is matted and cropped to fill rather than fitted transparent, and it
 * carries its place printed underneath. Until the file lands it falls back to
 * the same dashed outline every other object uses, labelled with the place
 * instead of the id, so the composition can still be judged.
 */
function PhotoArt({ object }: { object: DriftObject }) {
  const { state, onLoad, onError } = useArtState(object.src);
  const label = object.caption ?? object.id;

  return (
    <div className="relative h-full w-full">
      {state !== "loaded" && <Placeholder object={object} label={label} />}
      {state !== "absent" && (
        <div className="drift-photo" style={{ opacity: state === "loaded" ? 1 : 0 }}>
          <img
            src={object.src}
            alt={object.alt}
            loading="lazy"
            decoding="async"
            onLoad={onLoad}
            onError={onError}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      {state === "loaded" && object.caption !== undefined && (
        <span className="drift-photo-caption">{object.caption}</span>
      )}
    </div>
  );
}

/**
 * Every object belonging to one band. Anchored to the section rather than to an
 * absolute page offset, so objects stay with their section whatever the content
 * above them does.
 */
export function ObjectField({ bandId }: { bandId: BandId }) {
  const { narrow, armed } = useDepth();

  // Nothing renders before hydration: the page is complete without it.
  if (!armed) return null;

  const objects = objectsInBand(bandId, narrow);
  if (objects.length === 0) return null;

  return (
    <div className="drift-field" aria-hidden="true" data-print="hide">
      {objects.map((object) => (
        <DriftObjectView key={object.id} object={object} bandId={bandId} />
      ))}
    </div>
  );
}
