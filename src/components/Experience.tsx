import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";

import { experience, type Role } from "@/data/experience";
import { workPhotos } from "@/data/work";
import { Section } from "./Section";
import { Rise, RiseItem } from "./depth/Rise";
import { WorkReel } from "./WorkReel";

export function Experience() {
  return (
    <Section id="experience" title="Experience" band="experience">
      <WorkReel photos={workPhotos} />
      <div className="space-y-14">
        {experience.map((role) => (
          <RoleEntry key={`${role.employer}-${role.dates}`} role={role} />
        ))}
      </div>
    </Section>
  );
}

function RoleEntry({ role }: { role: Role }) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const footRef = useRef<HTMLLIElement>(null);
  const stop = usePictureStop(bodyRef, footRef, role.imageStop);

  // Spread rather than pass undefined: exactOptionalPropertyTypes is on.
  const stopProps =
    stop === null
      ? {}
      : {
          "data-picture-stop": "",
          style: { "--picture-stop": `${stop}px` } as CSSProperties,
        };

  return (
    <Rise as="article">
      <RiseItem
        as="header"
        className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-border/60 pb-3"
      >
        <h3 className="text-h3 text-bone">{role.title}</h3>
        <p className="text-fine text-sound">{role.employer}</p>
        <p className="ml-auto text-fine tabular-nums text-muted-foreground">
          {role.dates}
          <span className="hidden sm:inline"> · {role.location}</span>
        </p>
      </RiseItem>

      {/* The picture comes first and the writing is positioned after it,
          so every line paints over the picture rather than under it. */}
      <div
        ref={bodyRef}
        className="role-body"
        data-pictured={role.image ? "" : undefined}
        {...stopProps}
      >
        {role.image && (
          <RiseItem className="role-picture">
            <img src={role.image} alt="" loading="lazy" decoding="async" draggable={false} />
          </RiseItem>
        )}

        {role.context && (
          <RiseItem
            as="p"
            className="measure relative mt-3 text-fine leading-relaxed text-muted-foreground"
          >
            {role.context}
          </RiseItem>
        )}

        <RiseItem className="relative mt-5">
          <ul className="space-y-3 sm:pl-6">
            {role.projects.map((p, i) => (
              <li
                key={p.summary}
                ref={i + 1 === role.imageStop ? footRef : undefined}
                className="relative sm:pl-5"
              >
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-[0.7em] hidden h-px w-3 bg-sound/60 sm:block"
                />
                <p className="measure leading-relaxed text-bone">
                  <Summary {...p} />
                </p>
              </li>
            ))}
          </ul>
        </RiseItem>
      </div>
    </Rise>
  );
}

/**
 * How deep the picture runs when a role names a bullet to stop on: the distance
 * from the top of the body down to the foot of that bullet. Measured from the
 * offsets rather than from a client rect, because the writing is still carrying
 * its rise transform the first time this runs, and a transform moves what the
 * rect reports without moving the layout underneath it.
 */
function usePictureStop(
  bodyRef: RefObject<HTMLElement | null>,
  footRef: RefObject<HTMLElement | null>,
  imageStop: number | undefined,
): number | null {
  const [stop, setStop] = useState<number | null>(null);

  useEffect(() => {
    const body = bodyRef.current;
    const foot = footRef.current;
    if (!imageStop || !body || !foot) return;

    const measure = () => {
      let top = 0;
      for (
        let el: HTMLElement | null = foot;
        el && el !== body;
        el = el.offsetParent as HTMLElement | null
      ) {
        top += el.offsetTop;
      }
      setStop(top + foot.offsetHeight);
    };

    measure();
    // The writing reflows with the column and again when the face lands, and
    // the foot moves with it either way.
    const observer = new ResizeObserver(measure);
    observer.observe(body);
    observer.observe(foot);
    return () => observer.disconnect();
  }, [bodyRef, footRef, imageStop]);

  return stop;
}

function Summary({ summary, bold }: { summary: string; bold?: string }) {
  // Where the bold words fall in the summary. Not found, it is set plain.
  const at = bold ? summary.indexOf(bold) : -1;
  if (!bold || at === -1) return <>{summary}</>;
  return (
    <>
      {summary.slice(0, at)}
      <strong className="font-semibold">{bold}</strong>
      {summary.slice(at + bold.length)}
    </>
  );
}
