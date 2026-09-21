import { useState } from "react";
import { about } from "@/data/about";
import { profileLinks, site } from "@/data/site";
import { ProfileIcon } from "./ProfileIcon";
import { Section } from "./Section";
import { TravelWall } from "./TravelWall";
import { GutterField } from "./depth/ObjectField";
import { Rise, RiseItem } from "./depth/Rise";

function Frame({
  src,
  alt,
  ratio,
  className = "",
}: {
  src: string;
  alt: string;
  ratio: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`relative overflow-hidden rounded-sm border border-border/70 bg-shelf/20 ${className}`}
      style={{ aspectRatio: ratio }}
    >
      {failed ? (
        <svg aria-hidden="true" viewBox="0 0 100 125" className="h-full w-full" fill="none">
          {[46, 36, 26, 16, 8].map((r, i) => (
            <ellipse
              key={r}
              cx="50"
              cy="62"
              rx={r}
              ry={r * 0.72}
              stroke="var(--sound)"
              strokeWidth="0.8"
              opacity={0.28 - i * 0.04}
            />
          ))}
        </svg>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      )}
    </div>
  );
}

export function About() {
  return (
    <Section id="about" title="About" band="about">
      <Rise className="grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-14">
        {/* A flex column, so the gutter prints at the foot of it can take
            whatever room is left under the text rather than being placed at a
            guessed depth and drawn across it. */}
        <RiseItem className="flex flex-col">
          <Frame src={about.portrait} alt="Summer Royal" ratio="4 / 5" />

          {/* The card the beach carries, restated at the far end of the dive:
              by here the reader has read everything and the way to reach me is
              a page and a half back up. */}
          <dl className="mt-6 space-y-2.5 text-fine">
            {site.education.map((e) => (
              <div key={e.degree}>
                <dt className="tabular-nums text-sound">{e.year}</dt>
                <dd className="text-muted-foreground">
                  <span className="block text-bone">{e.degree}</span>
                  <span className="block">
                    {e.school}
                    {e.gpa && <span className="tabular-nums"> · GPA {e.gpa}</span>}
                  </span>
                </dd>
              </div>
            ))}
          </dl>

          <ul className="mt-6 space-y-1.5 text-fine">
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

          <GutterField />
        </RiseItem>

        <RiseItem>
          <div className="measure space-y-4 text-lede leading-relaxed text-bone">
            {about.body.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>

          <div className="measure mt-8">
            <p className="text-micro tracking-[0.18em] text-sound">HOBBIES</p>
            <p className="mt-3 text-lede leading-relaxed text-bone">{about.hobbies}</p>
          </div>
        </RiseItem>
      </Rise>

      <TravelWall />
    </Section>
  );
}
