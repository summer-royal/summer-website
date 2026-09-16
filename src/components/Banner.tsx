/**
 * Full-bleed cover image opening the homepage.
 *
 * The asset in public/ is the cover art at roughly 3:1, trimmed of the editor
 * frame it was captured with and of the top 5% of the sky. On desktop the cap
 * bites from ~1570px wide and crops from the bottom, so the banner never pushes
 * the name below the fold. The cap is 520px plus 1.77vw — 5% of the uncropped
 * art's rendered height — so that with the sky trimmed, a capped banner shows
 * 10% more of the bottom of the art than a flat 520px did.
 *
 * Phones crop in and bias right, keeping the subject whole on a narrow screen.
 */
export function Banner() {
  return (
    <div className="reveal relative isolate overflow-hidden" style={{ animationDelay: "0ms" }}>
      <img
        src="/banner.jpg"
        srcSet="/banner-1200.jpg 1200w, /banner.jpg 2079w"
        sizes="100vw"
        width={2079}
        height={698}
        alt="Stanford's Main Quad and Hoover Tower layered with streams of binary code and a glowing network of nodes, with a graduate in a Stanford sash at the right."
        fetchPriority="high"
        className="h-[160px] w-full object-cover object-[72%_50%] sm:h-auto sm:max-h-[calc(520px_+_1.77vw)] sm:object-top"
      />
      {/* Fades into whatever the band beneath it opens on — the sand, not the
          page's base colour, which is a cooler grey than the beach. It carries
          the sand's grain across the join; styles.css has why. */}
      <div
        aria-hidden="true"
        className="banner-foot pointer-events-none absolute inset-x-0 bottom-0 h-20"
      />
    </div>
  );
}
