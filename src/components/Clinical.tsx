import { certifications, clinicalNote, hospitalPhotos, shadowing } from "@/data/clinical";
import { Section } from "./Section";
import { WorkReel } from "./WorkReel";
import { Rise, RiseItem } from "./depth/Rise";

/**
 * Hospital work: where the shadowing happened and what it certified.
 *
 * Photographs from the hospital pass under the heading on the same reel the
 * Experience section opens with. Then two hospitals side by side with their
 * departments listed under each, and the certification below on its own rule —
 * the same header-and-detail shape the Experience roles use, so a reader
 * arrives already knowing how to read it.
 */
export function Clinical() {
  return (
    <Section id="clinical" title="Hospital Work" band="clinical">
      <WorkReel photos={hospitalPhotos} />
      <p className="measure text-lede leading-relaxed text-bone">{clinicalNote}</p>

      <div className="mt-10 grid gap-10 sm:grid-cols-2 sm:gap-14">
        {shadowing.map((place) => (
          <Rise key={place.hospital}>
            <RiseItem
              as="header"
              className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-border/60 pb-3"
            >
              <h3 className="text-h3 text-bone">{place.hospital}</h3>
              <p className="ml-auto text-fine text-muted-foreground">{place.location}</p>
            </RiseItem>
            <RiseItem as="p" className="mt-4 text-micro tracking-[0.18em] text-sound">
              SHADOWED IN
            </RiseItem>
            <RiseItem className="mt-3">
              <ul className="space-y-2">
                {place.departments.map((department) => (
                  <li key={department} className="relative pl-5">
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-[0.7em] h-px w-3 bg-sound/60"
                    />
                    <span className="leading-relaxed text-bone">{department}</span>
                  </li>
                ))}
              </ul>
            </RiseItem>
          </Rise>
        ))}
      </div>

      <Rise className="mt-12 border-t border-border/60 pt-8">
        <RiseItem as="p" className="text-micro tracking-[0.18em] text-sound">
          CERTIFICATIONS
        </RiseItem>
        {certifications.map((cert) => (
          <RiseItem key={cert.name} className="mt-4">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <h3 className="text-h3 text-bone">{cert.name}</h3>
              <p className="text-fine tabular-nums text-signal-ink">{cert.year}</p>
            </div>
            <p className="mt-1 text-fine text-muted-foreground">{cert.issuer}</p>
            <p className="measure mt-2 text-fine leading-relaxed text-bone">{cert.detail}</p>
          </RiseItem>
        ))}
      </Rise>
    </Section>
  );
}
