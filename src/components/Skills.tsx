import { skills } from "@/data/skills";
import { Section } from "./Section";
import { Rise, RiseItem } from "./depth/Rise";

/**
 * The toolkit, as four labelled registers rather than one tag cloud.
 *
 * Each group leads with its own line of prose and lists the items underneath in
 * the same bordered chips the projects use for their stack — so a reader who
 * wants the nouns can take them at a glance, and a reader who wants to know why
 * a group is on the page has a sentence to read.
 */
export function Skills() {
  return (
    <Section id="skills" title="Skills" band="skills">
      <div className="grid gap-10 sm:grid-cols-2 sm:gap-x-14 sm:gap-y-12">
        {skills.map((group) => (
          <Rise key={group.label}>
            <RiseItem as="h3" className="text-micro tracking-[0.18em] text-sound">
              {group.label}
            </RiseItem>
            {group.note ? (
              <RiseItem
                as="p"
                className="measure mt-3 text-fine leading-relaxed text-muted-foreground"
              >
                {group.note}
              </RiseItem>
            ) : null}
            <RiseItem className="mt-4 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="rounded-sm border border-sound/35 px-2 py-1 text-fine text-bone"
                >
                  {item}
                </span>
              ))}
            </RiseItem>
          </Rise>
        ))}
      </div>
    </Section>
  );
}
