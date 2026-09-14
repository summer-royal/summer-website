import { experience } from "@/data/experience";
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
          <Rise as="article" key={`${role.employer}-${role.dates}`}>
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
            <div className="role-body" data-pictured={role.image ? "" : undefined}>
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
                  {role.projects.map((p) => (
                    <li key={p.summary} className="relative sm:pl-5">
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-[0.7em] hidden h-px w-3 bg-sound/60 sm:block"
                      />
                      <p className="measure leading-relaxed text-bone">{p.summary}</p>
                    </li>
                  ))}
                </ul>
              </RiseItem>
            </div>
          </Rise>
        ))}
      </div>
    </Section>
  );
}
