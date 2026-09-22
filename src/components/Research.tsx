import { useState } from "react";

import { research, type ResearchBeat, type ResearchLab } from "@/data/research";
import { Fold } from "./Fold";
import { Section } from "./Section";
import { Rise, RiseItem } from "./depth/Rise";
import { PipelineFigure } from "./depth/PipelineFigure";

/**
 * One beat of a write-up: the heading stays out on deck, the writing under it
 * folds away. The folds are independent of one another — the beats are one
 * argument read in order, so opening the next is no reason to take the last
 * one back.
 */
function Beat({ beat }: { beat: ResearchBeat }) {
  const [open, setOpen] = useState(false);

  return (
    <Rise className="border-l border-sound/50 pl-5">
      <RiseItem as="p" className="font-display text-h3 text-sound">
        {beat.label}
      </RiseItem>
      <RiseItem className="mt-2">
        <Fold label="Click here to read more" open={open} onToggle={() => setOpen((o) => !o)}>
          <div className="space-y-2 pt-3">
            {beat.body.split("\n\n").map((paragraph, i) => (
              <p key={i} className="measure leading-relaxed text-bone">
                {paragraph}
              </p>
            ))}
          </div>
        </Fold>
      </RiseItem>
    </Rise>
  );
}

function Lab({ lab }: { lab: ResearchLab }) {
  return (
    <article id={lab.id} className="scroll-mt-24">
      <header className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-border/60 pb-3">
        <h3 className="text-h3 text-bone">{lab.lab}</h3>
        {lab.role && <p className="text-fine text-sound">{lab.role}</p>}
        {lab.dates && (
          <p className="ml-auto text-fine tabular-nums text-muted-foreground">
            {lab.dates}
            {lab.institution && <span className="hidden sm:inline"> · {lab.institution}</span>}
          </p>
        )}
      </header>

      {lab.pending ? (
        <p className="mt-4 text-fine italic text-muted-foreground">Write-up in progress.</p>
      ) : (
        <>
          <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-14">
            <div>
              <Rise>
                <RiseItem as="h4" className="font-display text-h3 leading-snug text-bone">
                  {lab.title}
                </RiseItem>
                <RiseItem
                  as="p"
                  className="measure mt-3 text-lede leading-relaxed text-muted-foreground"
                >
                  {lab.standfirst}
                </RiseItem>
              </Rise>

              <div className="mt-8 space-y-7">
                {lab.beats.map((beat) => (
                  <Beat key={beat.label} beat={beat} />
                ))}
              </div>
            </div>

            <aside className="lg:pt-2">
              <dl className="space-y-6 text-fine">
                {lab.facts.map((fact) => (
                  <div key={fact.label}>
                    <dt className="text-micro tracking-[0.18em] text-sound">{fact.label}</dt>
                    <dd className="mt-2 leading-relaxed text-bone">{fact.body}</dd>
                  </div>
                ))}
                {lab.metrics.length > 0 && (
                  <div>
                    <dt className="text-micro tracking-[0.18em] text-sound">RESULTS</dt>
                    <dd className="mt-2 space-y-2">
                      {lab.metrics.map((m) => (
                        <p key={m.label} className="text-bone">
                          <span className="font-display text-h3 text-signal-ink">{m.value}</span>{" "}
                          {m.label}
                        </p>
                      ))}
                    </dd>
                  </div>
                )}
                {lab.link && (
                  <div>
                    <dt className="text-micro tracking-[0.18em] text-sound">READ</dt>
                    <dd className="mt-2">
                      <a
                        className="link-signal"
                        href={lab.link.href}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        {lab.link.label}
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </aside>
          </div>

          {lab.pipeline && <PipelineFigure steps={lab.pipeline} />}
        </>
      )}
    </article>
  );
}

export function Research() {
  return (
    <Section id="research" title="Research" band="research">
      <div className="space-y-16 sm:space-y-20">
        {research.map((lab) => (
          <Lab key={lab.id} lab={lab} />
        ))}
      </div>
    </Section>
  );
}
