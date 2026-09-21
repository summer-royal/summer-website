import type { ReactElement } from "react";

/**
 * The marks beside the contact links — a letter for email, and the LinkedIn
 * and GitHub glyphs as those two actually draw them.
 *
 * The brands are solid because that is the only form either is recognised in:
 * outlined, the octocat collapses into a blob at link size. The envelope stays
 * a hairline, at the weight the rest of the site's line art is drawn at (Nav's
 * home, the dive figures) — it is a picture of a thing rather than a logotype,
 * and a filled one sits on the line like an inkblot. The three balance because
 * the envelope covers more ground than either glyph.
 *
 * Every mark is given the same 1.25em box, so a stacked list keeps one left
 * edge down the column however wide the glyph inside it is, and each tracks
 * whatever type size its link is set in — `text-base` on the beach, `text-fine`
 * in About and the footer. Colour comes from --signal-ink, which the depth
 * bands darken in step with the links themselves.
 */

const BOX = "h-[1.25em] w-[1.25em] shrink-0 text-signal-ink";

/** Shrinks a 24-unit glyph inside the shared box, about its own centre. */
const INSET = "translate(12 12) scale(0.88) translate(-12 -12)";

/** A sealed letter, flap down. */
function MailMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      className={BOX}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="2.4" y="4.8" width="19.2" height="14.4" rx="2" />
      <path d="M3.4 6.4l7.55 5.28a1.85 1.85 0 0 0 2.1 0L20.6 6.4" />
    </svg>
  );
}

/** The LinkedIn "in". */
function LinkedInMark() {
  return (
    <svg viewBox="0 0 24 24" className={BOX} fill="currentColor" aria-hidden="true" focusable="false">
      <path
        transform={INSET}
        d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM2.9 21.4V10h4.2v11.4H2.9Zm6.9 0V10h4v1.56h.06c.56-1.02 1.93-2.1 3.97-2.1 4.25 0 5.03 2.72 5.03 6.26v5.68h-4.2v-5.03c0-1.2-.02-2.75-1.7-2.75-1.7 0-1.96 1.31-1.96 2.66v5.12H9.8Z"
      />
    </svg>
  );
}

/** The GitHub cat. */
function GitHubMark() {
  return (
    <svg viewBox="0 0 24 24" className={BOX} fill="currentColor" aria-hidden="true" focusable="false">
      <path
        transform={INSET}
        d="M12 1.5a10.5 10.5 0 0 0-3.32 20.47c.53.1.72-.23.72-.5v-1.8c-2.92.63-3.54-1.4-3.54-1.4-.48-1.22-1.17-1.54-1.17-1.54-.95-.65.07-.64.07-.64 1.06.07 1.61 1.09 1.61 1.09.94 1.6 2.46 1.14 3.06.87.1-.68.37-1.14.66-1.4-2.33-.27-4.78-1.17-4.78-5.19 0-1.15.41-2.08 1.08-2.82-.11-.27-.47-1.34.1-2.79 0 0 .88-.28 2.89 1.08a9.9 9.9 0 0 1 5.26 0c2-1.36 2.88-1.08 2.88-1.08.58 1.45.22 2.52.11 2.79.67.74 1.08 1.67 1.08 2.82 0 4.03-2.46 4.92-4.8 5.18.38.33.71.97.71 1.96v2.9c0 .28.19.61.73.5A10.5 10.5 0 0 0 12 1.5Z"
      />
    </svg>
  );
}

const MARKS: Record<string, () => ReactElement> = {
  Email: MailMark,
  LinkedIn: LinkedInMark,
  GitHub: GitHubMark,
};

/**
 * The mark for a contact link, keyed off the label the link already carries.
 * A label with no mark of its own — the résumé — still takes the slot, so the
 * column does not step in and out.
 */
export function ProfileIcon({ label }: { label: string }) {
  const Mark = MARKS[label];
  if (!Mark) return <span className="h-[1.25em] w-[1.25em] shrink-0" aria-hidden="true" />;
  return <Mark />;
}
