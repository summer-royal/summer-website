import { communityNote, founded, memberships } from "@/data/community";
import { Section } from "./Section";
import { Rise, RiseItem } from "./depth/Rise";

/**
 * Memberships — the club that was founded, then the ones that were joined.
 *
 * SupplyHer gets the full header treatment because a co-founder's role is a
 * thing with weight; the other nine are chips, because nine annotated entries
 * would bury the one that matters and the list is itself the point.
 */
export function Community() {
  return (
    <Section id="community" title="Memberships" band="community">
      {founded.map((org) => (
        <Rise key={org.name} as="article">
          <RiseItem
            as="header"
            className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-border/60 pb-3"
          >
            <h3 className="text-h3 text-bone">{org.name}</h3>
            <p className="text-fine text-sound">{org.role}</p>
          </RiseItem>
          <RiseItem as="p" className="measure mt-4 text-lede leading-relaxed text-bone">
            {org.detail}
          </RiseItem>
        </Rise>
      ))}

      <Rise className="mt-12">
        <RiseItem as="p" className="text-micro tracking-[0.18em] text-sound">
          GENERAL MEMBER
        </RiseItem>
        <RiseItem className="mt-4 flex flex-wrap gap-2">
          {memberships.map((name) => (
            <span
              key={name}
              className="rounded-sm border border-sound/35 px-2 py-1 text-fine text-bone"
            >
              {name}
            </span>
          ))}
        </RiseItem>
        <RiseItem as="p" className="measure mt-5 text-fine leading-relaxed text-muted-foreground">
          {communityNote}
        </RiseItem>
      </Rise>
    </Section>
  );
}
