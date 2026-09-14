import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useRef, useState, type RefObject } from "react";

import { sideProjects, type SideProject } from "@/data/projects";
import { Section } from "./Section";
import { useDepth } from "./depth/DepthContext";
import { Rise, RiseItem } from "./depth/Rise";

const tileFrame =
  "relative flex w-full items-center justify-center overflow-hidden rounded-sm border border-border/70 bg-shelf/25";

const tileClass = `${tileFrame} h-28 sm:h-full sm:min-h-[9rem]`;

/**
 * A deck tile takes the slide's own 16:9 instead of the column's height, so it
 * is exactly as tall as the slide in it and no taller.
 */
const slideTileClass = `${tileFrame} aspect-video`;

const mediaClass = "absolute inset-0 h-full w-full object-cover";

/** Fetch the clip this far ahead of the viewport, so it is already running. */
const CLIP_MARGIN = "200px 0px 200px 0px";

/**
 * The viewport width a framed site is rendered at before being scaled into the
 * tile. An 11rem-wide frame would otherwise trigger the site's phone layout,
 * and the miniature would show a page no visitor to it ever sees.
 */
const SITE_FRAME_WIDTH = 1024;

function useNearViewport(ref: RefObject<HTMLElement | null>): boolean {
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) setNear(entry.isIntersecting);
      },
      { rootMargin: CLIP_MARGIN },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return near;
}

/**
 * The frame geometry that fills the tile exactly: the desktop width scaled down
 * to the tile's width, and a frame tall enough that what it renders reaches the
 * tile's bottom edge. Solving height against the tile rather than fixing it
 * keeps the whole page width in view — cropping the sides instead would cut the
 * site's own headline in half.
 */
function useFrameFit(ref: RefObject<HTMLElement | null>): { scale: number; height: number } {
  const [fit, setFit] = useState({ scale: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      if (!width || !height) return;
      const scale = width / SITE_FRAME_WIDTH;
      setFit({ scale, height: height / scale });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return fit;
}

/**
 * The corner stamp that says what opening a tile will get you. A slide tile
 * carries it in the top corner instead, clear of the wordmark a title slide
 * sets low — the slide now fills the tile, so there is no ground below it.
 */
function TileBadge({ children, top = false }: { children: string; top?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute right-2 ${top ? "top-2" : "bottom-2"} rounded-sm bg-stamp/85 px-1.5 py-0.5 text-micro tracking-[0.18em] text-stamp-ink transition-colors group-hover:bg-stamp-hover`}
    >
      {children}
    </span>
  );
}

/**
 * The click affordance. The tiles read as pictures — a framed site, a slide, a
 * PDF page — and a picture is not obviously a door, so every tile that opens
 * something carries this cursor over the middle of it, where the eye already
 * is, rather than in a corner it has to find.
 */
function TileCue() {
  return (
    <span
      aria-hidden="true"
      className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-stamp/85 text-stamp-ink shadow-md ring-1 ring-bone/15 transition duration-200 group-hover:scale-110 group-hover:bg-stamp-hover"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672z" />
        <path d="M12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
      </svg>
    </span>
  );
}

function TileArt({ mark }: { mark: string }) {
  return (
    <span aria-hidden="true" className="contents">
      <svg viewBox="0 0 200 120" className="absolute inset-0 h-full w-full" fill="none">
        {[54, 42, 30, 18].map((r, i) => (
          <ellipse
            key={r}
            cx="100"
            cy="60"
            rx={r * 1.6}
            ry={r}
            stroke="var(--sound)"
            strokeWidth="1"
            opacity={0.3 - i * 0.05}
          />
        ))}
      </svg>
      <span className="relative font-display text-h1 tracking-tight text-bone/85">{mark}</span>
    </span>
  );
}

/**
 * A silent clip in place of the tile mark. The poster frame is the tile until
 * the observer fires — and stays the tile under prefers-reduced-motion — so a
 * visitor who never reaches this section, or who asked for stillness, never
 * fetches the video at all.
 */
function ClipTile({ clip }: { clip: NonNullable<SideProject["clip"]> }) {
  const { mode, armed } = useDepth();
  const ref = useRef<HTMLDivElement>(null);
  const near = useNearViewport(ref);
  const play = armed && mode !== "reduced" && near;

  return (
    <div ref={ref} className={tileClass}>
      {play ? (
        <video
          src={clip.src}
          poster={clip.poster}
          aria-label={clip.alt}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className={mediaClass}
        />
      ) : (
        <img src={clip.poster} alt={clip.alt} decoding="async" className={mediaClass} />
      )}
    </div>
  );
}

/**
 * A deck's title slide as the tile image. The tile is cut to the slide's shape
 * rather than stretched down the column like the portrait pages beside it, so
 * the slide fills it edge to edge — no wordmark lost off the sides, and no
 * empty ground above and below.
 */
function DeckCover({ src }: { src: string }) {
  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      className={`${mediaClass} opacity-90 transition-opacity duration-200 group-hover:opacity-100`}
    />
  );
}

/** The height of the pager Google draws along the bottom of an embedded deck. */
const SLIDES_PAGER = "2.75rem";

/**
 * The title slide as the tile, with the deck itself behind it in a lightbox.
 *
 * An 11rem tile cannot show a slide legibly, and the embed is heavier than the
 * rest of the page put together — so the tile is a still image, and Radix only
 * mounts the iframe once someone actually asks for the deck. Closing it
 * unmounts the iframe again, which also stops the deck where it stands.
 */
function DeckTile({ name, deck }: { name: string; deck: NonNullable<SideProject["deck"]> }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger
        aria-label={`${name} — open the ${deck.label}`}
        className={`${slideTileClass} group cursor-pointer transition-colors hover:border-signal/70`}
      >
        <DeckCover src={deck.cover} />
        <TileCue />
        <TileBadge top>DECK</TileBadge>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-[#040e13]/85 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        {/*
         * The portal escapes the depth bands, so the panel re-declares the one
         * it opened from and keeps that palette. Its width is solved against
         * the shorter axis, so the 16:9 deck and its header always fit the
         * viewport rather than scrolling.
         */}
        <Dialog.Content
          data-band="projects"
          aria-describedby={undefined}
          className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,72rem,(88vh_-_7rem)*16/9)] -translate-x-1/2 -translate-y-1/2 rounded-sm border border-border bg-[var(--band-to)] p-3 shadow-2xl data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
        >
          <div className="flex items-center justify-between gap-4 pb-2">
            <Dialog.Title className="text-h3 text-bone">{name}</Dialog.Title>
            <div className="flex items-center gap-4">
              <a
                className="link-signal text-fine"
                href={deck.href}
                target="_blank"
                rel="noreferrer noopener"
              >
                Open in Google Slides
              </a>
              <Dialog.Close
                aria-label="Close the deck"
                className="cursor-pointer rounded-sm p-1 text-sound transition-colors hover:text-bone"
              >
                <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true">
                  <path
                    d="M3 3l10 10M13 3L3 13"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </Dialog.Close>
            </div>
          </div>
          {/*
           * Google hangs its own pager below the slide, inside the frame. The
           * frame is grown by exactly that strip and the box it sits in is not,
           * so the slide itself lands on a true 16:9 and stops being
           * pillarboxed in black.
           */}
          <div className="relative aspect-video w-full" style={{ marginBottom: SLIDES_PAGER }}>
            <iframe
              src={deck.embed}
              title={`${name} — ${deck.label}`}
              allowFullScreen
              className="absolute left-0 top-0 w-full rounded-sm border-0 bg-black"
              style={{ height: `calc(100% + ${SLIDES_PAGER})` }}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/**
 * The site itself as the tile, live rather than screenshotted, so it cannot go
 * stale behind the deployed page.
 *
 * The frame is laid out at a desktop viewport and scaled down to the tile's
 * width, top-aligned, so the miniature is the top of the page as a visitor
 * meets it. Nothing is requested until the tile nears the viewport, and the
 * mark stands in until then; the frame is inert and click-through, so the tile
 * behaves as the single link it looks like.
 */
function SiteTile({
  name,
  mark,
  site,
}: {
  name: string;
  mark: string;
  site: NonNullable<SideProject["site"]>;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const near = useNearViewport(ref);
  const { scale, height } = useFrameFit(ref);

  return (
    <a
      ref={ref}
      href={site.href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={`${name} — ${site.label}`}
      className={`${tileClass} paper group bg-white transition-colors hover:border-signal/70`}
    >
      {near && scale > 0 ? (
        <iframe
          src={site.href}
          title={site.alt}
          loading="lazy"
          tabIndex={-1}
          inert
          sandbox="allow-scripts allow-same-origin"
          style={{
            width: SITE_FRAME_WIDTH,
            height,
            transform: `translateX(-50%) scale(${scale})`,
          }}
          className="pointer-events-none absolute left-1/2 top-0 origin-top border-0 opacity-90 transition-opacity duration-200 group-hover:opacity-100"
        />
      ) : (
        <TileArt mark={mark} />
      )}
      <TileCue />
      <TileBadge>LIVE</TileBadge>
    </a>
  );
}

function Tile({ project }: { project: SideProject }) {
  if (project.deck?.embed) {
    return <DeckTile name={project.name} deck={project.deck} />;
  }

  if (project.deck) {
    /*
     * A deck exported to PDF has nothing to embed, so the tile links straight
     * to the file, as a paper's does — the tile still cut to the slide.
     */
    return (
      <a
        href={project.deck.href}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={`${project.name} — ${project.deck.label}`}
        className={`${slideTileClass} group transition-colors hover:border-signal/70`}
      >
        <DeckCover src={project.deck.cover} />
        <TileCue />
        <TileBadge top>DECK</TileBadge>
      </a>
    );
  }

  if (project.paper) {
    return (
      <a
        href={project.paper.href}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={`${project.name} — ${project.paper.label}`}
        className={`${tileClass} paper group bg-white transition-colors hover:border-signal/70`}
      >
        {project.paper.thumb ? (
          <img
            src={project.paper.thumb}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-top opacity-90 transition-opacity duration-200 group-hover:opacity-100"
          />
        ) : (
          <TileArt mark={project.mark} />
        )}
        <TileCue />
        <TileBadge>PDF</TileBadge>
      </a>
    );
  }

  if (project.clip) {
    return <ClipTile clip={project.clip} />;
  }

  if (project.site) {
    return <SiteTile name={project.name} mark={project.mark} site={project.site} />;
  }

  if (project.logo) {
    return (
      /*
       * Laid in whole rather than cropped to fill, as the deck cover is: the
       * badge is round, and a circle forced to the tile's rectangle loses its
       * rim. Floating it on the tile ground keeps the mark intact, and the
       * padding stops it touching the border.
       */
      <div className={`${tileClass} p-3`}>
        <img
          src={project.logo.src}
          alt={project.logo.alt}
          loading="lazy"
          decoding="async"
          className="max-h-full max-w-full object-contain"
        />
      </div>
    );
  }

  return (
    <div aria-hidden="true" className={tileClass}>
      <TileArt mark={project.mark} />
    </div>
  );
}

export function SideProjects() {
  return (
    <Section id="projects" title="Silly Little Side Projects" band="projects">
      <div className="space-y-10">
        {sideProjects.map((p) => (
          <Rise
            as="article"
            key={p.name}
            className="grid gap-5 border-t border-border/60 pt-8 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-8"
          >
            {/* A slide is shorter than the writing beside it, so it sits level
                with the middle of the writing rather than hanging from its top. */}
            <RiseItem className={p.deck ? "sm:self-center" : ""}>
              <Tile project={p} />
            </RiseItem>
            <RiseItem>
              <h3 className="text-h3 text-bone">{p.name}</h3>
              <p className="measure mt-2 leading-relaxed text-bone">{p.what}</p>
              <p className="measure mt-2 text-fine leading-relaxed text-muted-foreground">
                {p.why}
              </p>
              <p className="mt-3 flex flex-wrap gap-2">
                {p.stack.map((s) => (
                  <span
                    key={s}
                    className="rounded-sm border border-sound/35 px-1.5 py-0.5 text-micro text-sound"
                  >
                    {s}
                  </span>
                ))}
              </p>
              {(p.live || p.repo || p.paper || p.deck) && (
                <p className="mt-3 flex flex-wrap gap-5 text-fine">
                  {p.deck && (
                    <a
                      className="link-signal"
                      href={p.deck.href}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      {p.deck.embed ? "Slides" : "Slides (PDF)"}
                    </a>
                  )}
                  {p.paper && (
                    <a
                      className="link-signal"
                      href={p.paper.href}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      Paper (PDF)
                    </a>
                  )}
                  {p.live && (
                    <a
                      className="link-signal"
                      href={p.live}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      Live
                    </a>
                  )}
                  {p.repo && (
                    <a
                      className="link-signal"
                      href={p.repo}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      Repository
                    </a>
                  )}
                </p>
              )}
            </RiseItem>
          </Rise>
        ))}
      </div>
    </Section>
  );
}
