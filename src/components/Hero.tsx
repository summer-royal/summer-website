import { useState, type CSSProperties } from "react";

import { profileLinks, site } from "@/data/site";
import { Banner } from "./Banner";
import { ProfileIcon } from "./ProfileIcon";
import { CLEAR_MS, DiveButton } from "./Dive";
import { DepthBand } from "./depth/DepthBand";
import { TypedName } from "./TypedName";

/**
 * The beach — the whole of the first page.
 *
 * Nothing sits below it. Experience is on the far side of the dive, not
 * further down, so the button is the only way off the sand. The band is at
 * least a screen tall and clips at its foot, so the page ends on the beach
 * whatever the viewport, and nothing drifting in it can stretch the scroll.
 *
 * Pressing the dive empties it. The cover art and everything written on the
 * sand go together, leaving the beach, the board and the water — which is the
 * picture the dive was drawn for, and the only way the board and the copy stop
 * sharing the same few hundred pixels. The copy moves rather than the dive,
 * because the board has to stand a body's height clear of the water or there
 * is no dive left to watch.
 *
 * The clearing runs before the dive rather than under it: the board and the
 * diver both stand inside the banner, so the tide waits CLEAR_MS for the art
 * to go. That one number reaches the fades below as `--beach-clear`.
 */
export function Hero() {
  const [diving, setDiving] = useState(false);
  const clearing = { "--beach-clear": `${CLEAR_MS}ms` } as CSSProperties;

  return (
    <DepthBand band="hero" className="min-h-svh overflow-clip">
      <Banner diving={diving} style={clearing} />
      <div className="beach-stage">
        <div aria-hidden="true" data-print="hide" className="hero-surface" />
        <div
          className="beach-copy shell relative flex min-h-[46svh] flex-col justify-start pb-20 pt-3"
          data-diving={diving || undefined}
          style={clearing}
        >
          <h1
            aria-label={site.name}
            className="reveal text-h1 leading-[1.05] sm:text-display"
            style={{ animationDelay: "80ms" }}
          >
            <TypedName text={site.name} />
          </h1>
          <p
            className="reveal measure mt-6 text-lede leading-relaxed sm:text-h3"
            style={{ animationDelay: "200ms" }}
          >
            {site.positioning}
          </p>
          <ul
            className="reveal mt-6 flex flex-wrap gap-x-6 gap-y-3 text-base"
            style={{ animationDelay: "320ms" }}
          >
            {profileLinks.map((l) => (
              <li key={l.label} className="flex items-center gap-2">
                <ProfileIcon label={l.label} />
                <a
                  className="link-signal"
                  href={l.href}
                  {...(l.href.startsWith("http")
                    ? { target: "_blank", rel: "noreferrer noopener" }
                    : {})}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <dl className="reveal mt-8 space-y-1.5 text-fine" style={{ animationDelay: "460ms" }}>
            {site.education.map((e) => (
              <div key={e.degree} className="flex flex-wrap gap-x-3">
                <dt className="tabular-nums">{e.year}</dt>
                <dd>
                  {e.degree}, {e.school}
                  {e.gpa && <span className="tabular-nums"> · GPA {e.gpa}</span>}
                </dd>
              </div>
            ))}
          </dl>
          {/* Centred rather than ranged left with the rest: it is the one
              thing on the beach asking to be pressed, and the middle is
              where the eye ends up. */}
          <div className="reveal mt-8 flex justify-center" style={{ animationDelay: "600ms" }}>
            <DiveButton onDive={() => setDiving(true)} />
          </div>
        </div>
      </div>
    </DepthBand>
  );
}
