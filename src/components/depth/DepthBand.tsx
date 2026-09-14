import type { ReactNode } from "react";

import type { BandId } from "@/lib/depth";
import { ObjectField } from "./ObjectField";

/**
 * One depth band: a slice of the descent.
 *
 * The `data-band` attribute is what paints it — styles.css hangs the band's
 * background gradient and its whole set of text tokens off that one attribute.
 * Because the gradient is an ordinary static section background rather than a
 * scroll-driven layer, the descent costs nothing per frame and is already
 * correct under prefers-reduced-motion with no separate code path.
 */
export function DepthBand({
  band,
  children,
  className = "",
}: {
  band: BandId;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div data-band={band} className={`depth-band ${className}`}>
      <ObjectField bandId={band} />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
