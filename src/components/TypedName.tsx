import { Fragment, useEffect, useState } from "react";

import { useDepth } from "./depth/DepthContext";

/** The prompt sits a beat before the first letter, so the line is read as a
 * line before it starts moving. Roughly the length of the `reveal` fade. */
const LEAD_MS = 260;
/** One keystroke. Slow enough to read a name off, fast enough not to wait. */
const STEP_MS = 78;

/**
 * The name, typed.
 *
 * A prompt glyph, then the letters arriving one at a time under a caret that
 * blinks once the line is finished. It is the first thing on the beach and the
 * only thing on the page that types itself, so it announces a person rather
 * than decorating a heading.
 *
 * Two things it deliberately does not do:
 *
 * It never reflows. Every letter is in the DOM from the first paint and the
 * untyped ones are `visibility: hidden` — they hold their boxes, so the line
 * wraps the same way at every point in the run and nothing below it moves. The
 * caret is a zero-width element whose bar is drawn outside its own box, so
 * stepping it through the word costs no space either.
 *
 * It never hides the name. The letters are real text throughout, and the
 * heading carries the plain name as its label, so a screen reader is read one
 * name instead of a stutter of partial ones. Before hydration — and under
 * prefers-reduced-motion, where `mode` stays `reduced` — the line simply
 * stands complete with the caret parked at its end.
 */
export function TypedName({ text }: { text: string }) {
  const { mode, armed } = useDepth();
  const letters = [...text];
  const total = letters.length;
  const typing = armed && mode !== "reduced";
  const [typed, setTyped] = useState(total);

  useEffect(() => {
    if (!typing) {
      setTyped(total);
      return;
    }

    setTyped(0);
    let keys = 0;
    let step: number | undefined;
    const lead = window.setTimeout(() => {
      step = window.setInterval(() => {
        keys += 1;
        setTyped(keys);
        if (keys >= total) window.clearInterval(step);
      }, STEP_MS);
    }, LEAD_MS);

    return () => {
      window.clearTimeout(lead);
      window.clearInterval(step);
    };
  }, [typing, total]);

  const done = typed >= total;

  return (
    <span className="typed-name" aria-hidden="true" data-typing={done ? undefined : true}>
      <span className="typed-name-prompt">&gt;</span>{" "}
      {letters.map((letter, i) => (
        <Fragment key={i}>
          {i === typed && <span className="typed-caret" />}
          <span className="typed-name-letter" data-typed={i < typed || undefined}>
            {letter}
          </span>
        </Fragment>
      ))}
      {done && <span className="typed-caret" />}
    </span>
  );
}
