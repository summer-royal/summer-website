import type { ElementType, ReactNode } from "react";
import { motion, type Variants } from "motion/react";

import { useDepth } from "./DepthContext";

/**
 * Fires when the element's top edge crosses 65% of the viewport: the root is
 * shrunk 35% from the bottom, so intersection begins at the 65% line.
 */
const VIEWPORT = { once: true, margin: "0px 0px -35% 0px" } as const;

const group: Variants = {
  down: {},
  up: { transition: { staggerChildren: 0.06 } },
};

/**
 * Rises and settles with a little overshoot — damping ratio ≈ 0.6, so it goes
 * a shade past its resting place and comes back, the way something buoyant
 * arrives at the surface.
 */
const item: Variants = {
  down: { opacity: 0, y: 26 },
  up: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 130, damping: 13, mass: 0.9 },
  },
};

const TAGS = {
  div: motion.div,
  li: motion.li,
  article: motion.article,
  header: motion.header,
  p: motion.p,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
} satisfies Record<string, ElementType>;

type Tag = keyof typeof TAGS;

/** Deliberately narrow: these wrappers carry layout classes, nothing more. */
interface RiseProps {
  as?: Tag;
  children: ReactNode;
  className?: string;
}

/**
 * A group of elements that rise together. Keep a group to roughly a screenful —
 * one article, one header — so that everything in it is genuinely on its way
 * into view when the group fires, rather than animating far below the fold.
 */
export function Rise({ as = "div", children, className = "" }: RiseProps) {
  const { mode, armed } = useDepth();
  const Component = TAGS[as] as typeof motion.div;
  // Before hydration, and under prefers-reduced-motion, this is an ordinary
  // element rendering ordinary children — nothing is hidden waiting on JS.
  const animate = armed && mode !== "reduced";

  // Spread rather than pass undefined: exactOptionalPropertyTypes is on.
  const motionProps = animate
    ? { variants: group, initial: "down", whileInView: "up", viewport: VIEWPORT }
    : { initial: false as const };

  return (
    <Component className={className} {...motionProps}>
      {children}
    </Component>
  );
}

/** One staggered child of a `Rise`. */
export function RiseItem({ as = "div", children, className = "" }: RiseProps) {
  const { mode, armed } = useDepth();
  const Component = TAGS[as] as typeof motion.div;
  const animate = armed && mode !== "reduced";

  const motionProps = animate ? { variants: item } : {};

  return (
    <Component className={className} {...motionProps}>
      {children}
    </Component>
  );
}
