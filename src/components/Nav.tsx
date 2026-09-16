import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

import { useDepth } from "./depth/DepthContext";

const items = [
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "research", label: "Research" },
  { id: "awards", label: "Awards" },
  { id: "projects", label: "Projects" },
  { id: "clinical", label: "Hospital Work" },
  { id: "about", label: "About" },
];

/**
 * How many sub-bands each band's palette is cut into.
 *
 * The bar is 88% its own colour over the water, so a single colour per band
 * only tracked the water while the water barely moved. Now that it descends at
 * a steady rate, a long band would leave the bar sitting visibly lighter than
 * the water behind it. Each step spans about 5 dE, which holds the bar within
 * ~2.5 dE of the water everywhere — under where the eye reads it as a block
 * laid over the page rather than a pane cut into it. Counts come from the
 * colour curve, not from any layout, so they do not move with the viewport.
 */
const NAV_STEPS: Record<string, number> = {
  experience: 2,
  skills: 1,
  research: 4,
  descent: 2,
  awards: 2,
  // Two, not three: Projects gave its last third of water to Clinical and
  // Community, and what it keeps is now about 9 dE rather than 13.
  projects: 2,
  clinical: 1,
  community: 1,
  about: 2,
  reading: 1,
  footer: 1,
};

/**
 * The bar the visitor keeps while everything behind it changes colour.
 *
 * It lives on the dive page only. The beach has no bar: its one way onward is
 * the dive, and a row of section links over the sand would be a second.
 *
 * It carries its own palette per sub-band — solved against the bar's own
 * translucent background rather than the page's — and takes a band on once
 * that band's top edge is a third of the way up the viewport, which is where
 * the water behind has already turned over.
 */
export function Nav() {
  const { scrollY } = useDepth();
  const [active, setActive] = useState<string>("");
  const [navBand, setNavBand] = useState<string>("experience-0");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-88px 0px -60% 0px", threshold: 0 },
    );
    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const bands = Array.from(document.querySelectorAll<HTMLElement>("[data-band]"));
    if (bands.length === 0) return;

    let offsets: { id: string; top: number; height: number }[] = [];

    // Take a band on only once its top edge has climbed a little past the bar,
    // so the palette turns over where the water behind the bar already has.
    const ADOPT_ABOVE = 96;

    const update = (y: number) => {
      const line = y - ADOPT_ABOVE;
      let current = offsets[0];
      for (const b of offsets) {
        if (b.top <= line) current = b;
      }
      if (!current) return;
      const steps = NAV_STEPS[current.id] ?? 1;
      const into = current.height > 0 ? (line - current.top) / current.height : 0;
      const step = Math.min(steps - 1, Math.max(0, Math.floor(into * steps)));
      const next = `${current.id}-${step}`;
      setNavBand((was) => (was === next ? was : next));
    };

    const measure = () => {
      offsets = bands
        .map((el) => {
          const rect = el.getBoundingClientRect();
          return {
            id: el.dataset["band"] ?? "",
            top: rect.top + window.scrollY,
            height: rect.height,
          };
        })
        .filter((b) => b.id !== "");
      update(window.scrollY);
    };

    measure();
    const resize = new ResizeObserver(measure);
    bands.forEach((el) => resize.observe(el));
    window.addEventListener("resize", measure, { passive: true });
    const unsubscribe = scrollY.on("change", update);

    return () => {
      resize.disconnect();
      window.removeEventListener("resize", measure);
      unsubscribe();
    };
  }, [scrollY]);

  return (
    <header
      data-print="hide"
      data-nav-band={navBand}
      className="site-nav sticky top-0 z-50 backdrop-blur-md"
    >
      <nav aria-label="Sections" className="shell flex h-14 items-center justify-between gap-4">
        {/* Home is the beach, which is a page of its own rather than the top of this one. */}
        <Link
          to="/"
          title="Back to the home page"
          aria-label="Back to the home page"
          className="site-nav-brand inline-flex items-center gap-2.5 font-display text-base tracking-[0.08em]"
        >
          {/* The mark is lit artwork on black, so it carries its own dark plate rather
              than trying to sit on the bar's palette, which runs pale up top. The
              wordmark beside it is live type, not the one baked into the artwork:
              that one lands under 4px tall at this height. */}
          <img
            src="/logo-mark.webp"
            alt=""
            aria-hidden="true"
            width={250}
            height={160}
            className="site-nav-logo shrink-0"
          />
          S. ROYAL
        </Link>
        <ul className="-mr-1 flex items-center gap-1 overflow-x-auto text-fine sm:gap-2">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={active === item.id ? "true" : undefined}
                className="site-nav-link inline-block whitespace-nowrap rounded-sm px-2 py-1.5"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
