import { awards } from "@/data/awards";
import { Section } from "./Section";
import { Rise, RiseItem } from "./depth/Rise";

export function Awards() {
  return (
    <Section id="awards" title="Honors & Awards" band="awards">
      <ol className="relative border-l border-border/70">
        {awards.map((a) => (
          <Rise as="li" key={a.name} className="relative pb-9 pl-6 last:pb-0 sm:pl-8">
            <span
              aria-hidden="true"
              className="absolute -left-[3px] top-[0.6em] h-1.5 w-1.5 rounded-full bg-sound"
            />
            <RiseItem className="flex flex-wrap items-baseline gap-x-3">
              <span className="font-display text-h3 tabular-nums text-sound">{a.year}</span>
              <h3 className="text-base font-medium text-bone">{a.name}</h3>
            </RiseItem>
            <RiseItem as="p" className="mt-1 text-fine text-signal-ink">
              {a.honor}
            </RiseItem>
            <RiseItem
              as="p"
              className="measure mt-1.5 text-fine leading-relaxed text-muted-foreground"
            >
              {a.detail}
            </RiseItem>
          </Rise>
        ))}
      </ol>
    </Section>
  );
}
