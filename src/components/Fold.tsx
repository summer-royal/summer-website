import { useId, type ReactNode } from "react";

/**
 * A run of writing folded away behind a line you press — the job descriptions
 * in Experience, the beats of each write-up in Research.
 *
 * The panel is never unmounted. It is clipped by a grid track travelling
 * between 0fr and 1fr, which is the one way to ease a panel open to a height
 * nobody has measured, and staying in the page is what lets print open every
 * one of them at once. `inert` is what actually closes it to a reader: the
 * clip only hides it, while `inert` takes the folded writing out of the
 * reading order and out of the tab order.
 *
 * The open state is held by whoever renders it, since only the caller knows
 * whether its folds are independent or take turns.
 */
export function Fold({
  label,
  open,
  onToggle,
  children,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  const panelId = useId();

  return (
    <>
      <button
        type="button"
        className="fold-toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        data-print="hide"
      >
        {label}
        <Arrowhead />
      </button>

      <div id={panelId} className="fold" data-open={open || undefined} inert={!open}>
        <div className="fold-clip">{children}</div>
      </div>
    </>
  );
}

/** The mark on the toggle: a hairline chevron, turned up once the fold is open. */
function Arrowhead() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="fold-toggle-mark"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M5 9l7 7 7-7" />
    </svg>
  );
}
