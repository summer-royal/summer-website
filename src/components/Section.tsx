import type { ReactNode } from "react";

import type { BandId } from "@/lib/depth";
import { DepthBand } from "./depth/DepthBand";
import { Rise, RiseItem } from "./depth/Rise";

/**
 * The band between Research and Awards, where the water turns over.
 *
 * The light-to-dark crossover is compressed into this one short, empty band on
 * purpose: no single text colour clears 4.5:1 across a sweep from a pale
 * background to a dark one, so nothing is asked to be legible here.
 */
export function DescentBand() {
  return <DepthBand band="descent" className="descent-band" />;
}

export function Section({
  id,
  title,
  band,
  children,
}: {
  id: string;
  title: string;
  band: BandId;
  children: ReactNode;
}) {
  return (
    <DepthBand band={band}>
      <section id={id} className="scroll-mt-24 py-16 sm:py-24">
        <div className="shell">
          <Rise>
            <RiseItem as="h2" className="text-h2 sm:text-h1 text-bone">
              {title}
            </RiseItem>
          </Rise>
          <div className="mt-8 sm:mt-12">{children}</div>
        </div>
      </section>
    </DepthBand>
  );
}
